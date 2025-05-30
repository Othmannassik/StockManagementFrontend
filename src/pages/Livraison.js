import React, { useState, useEffect, useRef } from 'react';
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
import { useAccessToken } from '../services/AccessTokenProvider';

export default function Livraisons() {
    const emptyLivraison = {
        idLiv: null,
        numBonLiv: "",
        date: null,
        quantity: 0,
        commande: "",
    };

    const [livraisons, setLivraisons] = useState(null);
    const [commandes, setCommandes] = useState(null);
    const [commande, setCommande] = useState(null);
    const [livraisonDialog, setLivraisonDialog] = useState(false);
    const [deleteLivraisonDialog, setDeleteLivraisonDialog] = useState(false);
    const [deleteLivraisonsDialog, setDeleteLivraisonsDialog] = useState(false);
    const [livraison, setLivraison] = useState(emptyLivraison);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedLivraisons, setSelectedLivraisons] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [showCommandeInput, setShowCommandeInput] = useState(true);
    const [showQteInput, setShowQteInput] = useState(true);
    const fileUploadRef = useRef(null);
    const toast = useRef(null);
    let { accessToken } = useAccessToken();

    const loadLivraisonsData = () => {
        LivraisonService.getLivraisons(accessToken).then((data) => setLivraisons(data));
    }

    useEffect(() => {
        if(!accessToken){
            accessToken = localStorage.getItem('access_token');
        }
        loadLivraisonsData();
        CommandeService.getCommandes(accessToken).then((data) => setCommandes(data));
    }, []);

    const openNew = () => {
        setLivraison(emptyLivraison);
        setLivraisonDialog(true);
        setShowCommandeInput(true);
        setShowQteInput(true);
    };

    const hideDialog = () => {
        setLivraisonDialog(false);
    };

    const hideDeleteLivraisonDialog = () => {
        setDeleteLivraisonDialog(false);
    };

    const hideDeleteLivraisonsDialog = () => {
        setDeleteLivraisonsDialog(false);
    };

    const saveLivraison = () => {

        const uploadedFiles = fileUploadRef.current.getFiles();
        const uploadedFile = uploadedFiles[0];
        const formData = new FormData();
        formData.append("livraison", JSON.stringify(livraison));
        formData.append("file", uploadedFile);

        if (livraison.numBonLiv && livraison.date && uploadedFile) {

            if (livraison.idLiv) {
                livraison.commande = commande
                LivraisonService.updateLivraison(livraison.idLiv, commande.idCmd, formData, accessToken)
                .then((data) => {
                    loadLivraisonsData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Modifié', life: 3000 })
                })                
            } else {
                if (!livraison.quantity || !livraison.commande){
                    toast.current.show({ severity: 'error', summary: 'Echèc !', detail: 'Veuillez Remplir Tous Les Champs', life: 3000 })
                    return;
                }
                LivraisonService.createLivraison(formData, livraison.commande.idCmd, accessToken)
                .then((data) => {
                    loadLivraisonsData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Creé', life: 3000 })
                })
            }

        } else {
            toast.current.show({ severity: 'error', summary: 'Echèc !', detail: 'Veuillez Remplir Tous Les Champs', life: 3000 })
            return;
        }

        setLivraisonDialog(false);
        setLivraison(emptyLivraison);
        setShowQteInput(true);
    };
    
    

    const editLivraison = async (livraison) => {
        const cmd = await LivraisonService.cmdByLivraison(livraison.idLiv, accessToken); 
        setCommande(cmd);
        setLivraison(livraison);
        setLivraisonDialog(true);
        setShowCommandeInput(false);
        setShowQteInput(false);
    };

    const confirmDeleteLivraison = (livraison) => {
        setLivraison(livraison);
        setDeleteLivraisonDialog(true);
    };

    const deleteLivraison = () => {
        LivraisonService.deletePLivraison(livraison.idLiv, accessToken)
            .then(() => {
                loadLivraisonsData();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Supprimé', life: 3000 });
            })

        setDeleteLivraisonDialog(false);
        setLivraison(emptyLivraison);
    };

    const downloadBL = (rowData) => {
        LivraisonService.downloadBL(rowData.bonLiv.id, accessToken)
        .then((response) => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = rowData.bonLiv.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('Error downloading BL', error);
        });
    };

    const exportExcel = () => {
        LivraisonService.export(accessToken)
        .then((response) => {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Livraisons";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('Error exporting data', error);
        });
      };

    const confirmDeleteSelected = () => {
        setDeleteLivraisonsDialog(true);
    };

    const deleteSelectedLivraisons = () => {
        const promises = selectedLivraisons.map((liv) => {
            return LivraisonService.deletePLivraison(liv.idLiv, accessToken);
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
              <Button icon="pi pi-download" severity="secondary" onClick={exportExcel} />
          </div>
        );
    };

    const bonLivAction = (rowData) => {
        return (
            <fragment>
                <Button label='Bon Liv' icon="pi pi-download" rounded className="mr-2" onClick={() => downloadBL(rowData)} />
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
              const cmd = await LivraisonService.cmdByLivraison(rowData.idLiv, accessToken); // Replace with your actual backend API call
              setCommande(cmd.numBonCmd);
            } catch (error) {
              console.error('Error fetching commande count:', error);
              setCommande("");
            }
          };
      
          fetchdata();
        }, [rowData.idLiv]);
      
        return commande;
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
                <Column field="numBonLiv" header="N° BL" sortable/>
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
                    <Calendar placeholder="entrer la date" value={livraison.date} onChange={(e) => onInputChange(e, 'date')}  required autoFocus/>
                </div>  
                <div className="field">
                    <span htmlFor="numBonLiv" className="font-bold">
                        N° BL
                    </span>
                    <InputText value={livraison.numBonLiv} onChange={(e) => onInputChange(e, 'numBonLiv')}  placeholder="Bon Livraison"  required autoFocus />
                </div> 
                <div className="field">
                    { showCommandeInput && (
                        <>
                            <span htmlFor="commande" className="font-bold">
                                Commande
                            </span>
                            <Dropdown value={livraison.commande} onChange={(e) => onInputChange(e, "commande")} options={commandes} optionLabel="numBonCmd" placeholder="Select a Commande" 
                                    filter showClear valueTemplate={selectedCommandeTemplate} itemTemplate={commandeOptionTemplate} required autoFocus />
                        </>
                    )}
                </div>
                <div className="formgrid grid">
                    { showQteInput && (
                        <>
                            <div className="field col">
                                <span htmlFor="quantity" className="font-bold">
                                    Quantité
                                </span>
                                <InputNumber placeholder='quantités' id="quantity" value={livraison.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} mode="decimal" required autoFocus />
                            </div>
                        </>
                    )}
                    <div className="field col">
                            <span htmlFor="bl" className="font-bold">
                                BonLiv
                            </span>
                            <FileUpload ref={fileUploadRef} mode="basic" name="demo[]" url="/api/upload" accept=".pdf"/>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteLivraisonDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteLivraisonDialogFooter} onHide={hideDeleteLivraisonDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {livraison && <span>Êtes-vous sûr de vouloir supprimer la livraison <b>{livraison.numBonLiv}</b>?</span>}
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

