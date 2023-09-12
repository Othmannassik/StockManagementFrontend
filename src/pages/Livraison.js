import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { LivraisonService } from '../services/LivraisonService';
import { CommandeService } from '../services/CommandeService';

export default function Livraisons() {
    const emptyLivraison = {
        idLiv: null,
        bonLiv: "",
        date: null,
        quantity: 0,
        commande: "",
    };

    const [livraisons, setLivraisons] = useState(null);
    const [commandes, setCommandes] = useState(null);
    const [livraisonDialog, setLivraisonDialog] = useState(false);
    const [deleteLivraisonDialog, setDeleteLivraisonDialog] = useState(false);
    const [deleteLivraisonsDialog, setDeleteLivraisonsDialog] = useState(false);
    const [livraison, setLivraison] = useState(emptyLivraison);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedLivraisons, setSelectedLivraisons] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showCommandeInput, setShowCommandeInput] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);
    const _livraison = Livraisons;

    const loadLivraisonsData = () => {
        LivraisonService.getLivraisons().then((data) => setLivraisons(data));
    }

    useEffect(() => {
        loadLivraisonsData();
        CommandeService.getCommandes().then((data) => setCommandes(data));
    }, []);

    const addLivraison = () => {
        if (!livraison.model || !livraison.date || livraison.quantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Erreur !', detail: 'Veuillez remplir tous les champs requis.', life: 3000 });
            return;
        }

        const newId = createId();

        const newLivraison = {
            id: newId,
            bonLiv: livraison.bonLiv,
            bonCmd: livraison.bonCmd,
            model: livraison.model,
            date: livraison.date,
            quantity: livraison.quantity,
            // Ajoutez d'autres propriétés de livraison ici
        };

        const updatedLivraisons = [...livraison, newLivraison];
        setLivraisons(updatedLivraisons);

        setLivraison(emptyLivraison);

        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison ajoutée avec succès.', life: 3000 });
    };

    const openNew = () => {
        setLivraison(emptyLivraison);
        setSubmitted(false);
        setLivraisonDialog(true);
        setShowCommandeInput(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setLivraisonDialog(false);
    };

    const hideDeleteLivraisonDialog = () => {
        setDeleteLivraisonDialog(false);
    };

    const hideDeleteLivraisonsDialog = () => {
        setDeleteLivraisonsDialog(false);
    };

    const saveLivraison = () => {
        setSubmitted(true);

        if (livraison.bonLiv.trim()) {

            if (livraison.idLiv) {
                LivraisonService.updateLivraison(livraison.idLiv, livraison)
                .then((data) => {
                    loadLivraisonsData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Modifié', life: 3000 })
                })                
            } else {
                LivraisonService.createLivraison(livraison, livraison.commande.idCmd)
                .then((data) => {
                    loadLivraisonsData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Creé', life: 3000 })
                })
            }

            setLivraisonDialog(false);
            setLivraison(emptyLivraison);
        }
    };
    
    

    const editLivraison = (livraison) => {
        setLivraison({ ...livraison });
        setLivraisonDialog(true);
        setShowCommandeInput(false);
    };

    const confirmDeleteLivraison = (livraison) => {
        setLivraison(livraison);
        setDeleteLivraisonDialog(true);
    };

    const deleteLivraison = () => {
        LivraisonService.deletePLivraison(livraison.idLiv)
            .then(() => {
                loadLivraisonsData();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Supprimé', life: 3000 });
            })

        setDeleteLivraisonDialog(false);
        setLivraison(emptyLivraison);
    };
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < livraisons.length; i+=1) {
            if (livraisons[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i+=1) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteLivraisonsDialog(true);
    };

    const deleteSelectedLivraisons = () => {
        const promises = selectedLivraisons.map((liv) => {
            return LivraisonService.deletePLivraison(liv.idLiv);
        });
    
        Promise.all(promises)
            .then(() => {
                // After all items are successfully deleted, refresh the data
                return loadLivraisonsData();
            })
            .then(() => {
                // Clear the selected items and hide the delete dialog
                setSelectedLivraisons(null);
                setDeleteLivraisonsDialog(false);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraisons Supprimés', life: 3000 });
            })
            .catch((error) => {
                console.error('Error deleting selected items', error);
                // Handle error if necessary
            });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _livraison = { ...livraison };

        _livraison[`${name}`] = val;

        setLivraison(_livraison);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        const _livraison = { ...livraison };

        _livraison[`${name}`] = val;

        setLivraison(_livraison);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Ajouter" icon="pi pi-plus" raised severity="success" onClick={openNew} />
                <Button label="Supprimer" icon="pi pi-trash" raised severity="danger" onClick={confirmDeleteSelected} disabled={!selectedLivraisons || !selectedLivraisons.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
          <div className="flex flex-wrap gap-2">
              <Button icon="pi pi-download" severity="secondary" onClick={exportCSV} />
          </div>
        );
    };

    const bonLivAction = () => {
        return (
            <fragment>
                <Button label='Bon Liv' icon="pi pi-download" rounded className="mr-2" />
            </fragment>
        ); 
    };

    const getSeverity = (rowData) => {
      let status;
      if(rowData.status === "CREATED") {
        status = "info";
      } else if (rowData.status === "PENDING") {
        status = "warning";
      } else if (rowData.status === "DELIVERED") {
        status = "success";
      } else {
        status = "danger";
      }
      return status;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editLivraison(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteLivraison(rowData)} />
            </fragment>
        );
    };

    const NumBoncmd = (rowData) => {
        const [commande, setCommande] = useState(null);
      
        useEffect(() => {
          const fetchdata = async () => {
            try {
              const cmd = await LivraisonService.cmdByLivraison(rowData.idLiv); // Replace with your actual backend API call
              setCommande(cmd);
            } catch (error) {
              console.error('Error fetching commande count:', error);
              setCommande(0);
            }
          };
      
          fetchdata();
        }, [rowData.idLiv]);
      
        return commande;
      };

    const statusBodyTemplate = (rowData) => {
        let tag;
          if(rowData.status === "CREATED") {
            tag = <Tag value="CRÉÉ" severity={getSeverity(rowData)} />;
          } else if (rowData.status === "PENDING") {
            tag = <Tag value="EN ATTENTE" severity={getSeverity(rowData)} />;
          } else if (rowData.status === "DELIVERED") {
            tag = <Tag value="LIVRÉ" severity={getSeverity(rowData)} />;
          }else {
            tag = <Tag value="ANNULÉ" severity={getSeverity(rowData)} />;
          }
          return tag;
      };

      const selectedCommandeTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.numBonCmd}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const commandeOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.numBonCmd}</div>
            </div>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-2">
                <div className="formgrid grid">
                    <div className="field col">
                        <h4>Livraisons du :  {data.bonCmd}</h4>
                    </div>
                </div>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Livraisons</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
            </span>
        </div>
    );

    const livraisonDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveLivraison} />
        </fragment>
    );

    const deleteLivraisonDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteLivraisonDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteLivraison} />
        </fragment>
    );

    const deleteLivraisonsDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteLivraisonsDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedLivraisons} />
        </fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable value={livraisons} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate} selection={selectedLivraisons} onSelectionChange={(e) => setSelectedLivraisons(e.value)}
                    dataKey="idLiv" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} livraisons" globalFilter={globalFilter}  header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column selectionMode="multiple" exportable={false} />
                <Column field="bonLiv" header="N° BL" sortable/>
                <Column header="N° BC" body={NumBoncmd} sortable/>
                <Column field="date" header="Date" sortable/>
                <Column field="quantity" header="Quantité" sortable />
                <Column field="" header="Bon Livraison" body={bonLivAction} />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>
            </div>
            <Dialog visible={livraisonDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Livraison Détails" modal className="p-fluid" footer={livraisonDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="date" className="font-bold">
                        Date
                    </span>
                    <Calendar placeholder="entrer la date" value={livraison.date} onChange={(e) => onInputChange(e, 'date')}  required autoFocus className={classNames({ 'p-invalid': submitted && !livraison.date })}/>
                    {submitted && !livraison.date && <small className="p-error">Date is required.</small>}
                </div>  
                <div className="field">
                    <span htmlFor="bonLiv" className="font-bold">
                        N° BL
                    </span>
                    <InputText value={livraison.bonLiv} onChange={(e) => onInputChange(e, 'bonLiv')}  placeholder="Bon Livraison"  required autoFocus className={classNames({ 'p-invalid': submitted && !livraison.bonLiv })} />
                    {submitted && !livraison.bonLiv && <small className="p-error">bonLiv is required.</small>}
                </div> 
                <div className="field">
                    { showCommandeInput && (
                        <>
                            <span htmlFor="commande" className="font-bold">
                                Commande
                            </span>
                            <Dropdown value={livraison.commande} onChange={(e) => onInputChange(e, "commande")} options={commandes} optionLabel="numBonCmd" placeholder="Select a Commande" 
                                    filter valueTemplate={selectedCommandeTemplate} itemTemplate={commandeOptionTemplate} required autoFocus />
                        </>
                    )}
                </div>
                <div className="field">
                    <span htmlFor="quantity" className="font-bold">
                        Quantité
                    </span>
                    <InputNumber placeholder='quantités' id="quantity" value={livraison.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} mode="decimal" required autoFocus className={classNames({ 'p-invalid': submitted && livraison.quantity <= 0 })} />
                    {submitted && livraison.quantity <= 0 && <small className="p-error">Quantité must be greater than 0.</small>}
                </div>
                <div className="field col">
                        <span htmlFor="bl" className="font-bold">
                            BonLiv
                        </span>
                        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" />
                    </div>
            </Dialog>

            <Dialog visible={deleteLivraisonDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteLivraisonDialogFooter} onHide={hideDeleteLivraisonDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {livraison && <span>Êtes-vous sûr de vouloir supprimer la livraison <b>{livraison.bonLiv}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteLivraisonsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteLivraisonsDialogFooter} onHide={hideDeleteLivraisonsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedLivraisons && <span>Êtes-vous sûr de vouloir supprimer les livraisons sélectionnées?</span>}
                </div>
            </Dialog>
        </div>
    );
}

