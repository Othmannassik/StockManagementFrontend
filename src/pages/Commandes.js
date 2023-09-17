import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CommandeService } from '../services/CommandeService';
import { EtablissementService } from '../services/EtablissementService';
import { MaterielService } from '../services/MaterielService';
import { LivraisonService } from '../services/LivraisonService';


export default function CommandesDemo() {
    const emptyCommande = {
        idCmd: null,
        date: null,
        numBonCmd: "",
        quantity: 0,
        prestataire: "",
        materiel: "",
        etablissement: '',
    };

    const emptyLivraison = {
        idLiv: null,
        bonLiv: "",
        date: null,
        quantity: 0,
        commande: "",
    };

    const [commandes, setCommandes] = useState(null);
    const [prestataires, setPrestataires] = useState(null);
    const [materiels, setMateriels] = useState(null);
    const [etablissements, setEtablissements] = useState(null);
    const [commandeDialog, setCommandeDialog] = useState(false);
    const [livraisonDialog, setLivraisonDialog] = useState(false);
    const [deleteCommandeDialog, setDeleteCommandeDialog] = useState(false);
    const [deleteCommandesDialog, setDeleteCommandesDialog] = useState(false);
    const [commande, setCommande] = useState(emptyCommande);
    const [livraison, setLivraison] = useState(emptyLivraison);
    const [expandedRows, setExpandedRows] = useState(null);
    const [expandedItemData, setExpandedItemData] = useState(null);
    const [selectedCommandes, setSelectedCommandes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const loadCommandesData = () => {
        CommandeService.getCommandes().then((data) => setCommandes(data))
            .catch((err) => toast.current.show({ severity: 'error', summary: 'Echèc !', detail: err.message, life: 3000 }));
    }

    useEffect(() => {

        loadCommandesData();

        EtablissementService.getEtablissements()
            .then((data) => setEtablissements(data))

        CommandeService.getPrestataires()
            .then((data) => setPrestataires(data))

        MaterielService.getMateriels()
            .then((data) => setMateriels(data))
    }, []);

    const openNew = () => {
        setCommande(emptyCommande);
        setSubmitted(false);
        setCommandeDialog(true);
    };

    const openNew2 = (data) => {
        setExpandedItemData(data);
        setLivraison(emptyLivraison);
        setLivraisonDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCommandeDialog(false);
        setLivraisonDialog(false);
    };

    const hideDeleteCommandeDialog = () => {
        setDeleteCommandeDialog(false);
    };

    const hideDeleteCommandesDialog = () => {
        setDeleteCommandesDialog(false);
    };

    const saveCommande = () => {
        setSubmitted(true);

        if (commande.numBonCmd) {

            if (commande.idCmd) {
                CommandeService.updateCommande(commande.idCmd, commande)
                .then((data) => {
                    loadCommandesData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commande Modifié', life: 3000 })
                })                
            } else {
                CommandeService.addCommande(commande)
                .then((data) => {
                    loadCommandesData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commande Creé', life: 3000 })
                })
            }

            setCommandeDialog(false);
            setCommande(emptyCommande);
        }
    };

    const saveLivraison = () => {
        setSubmitted(true);

        livraison.commande = expandedItemData;

        if (livraison.bonLiv) {

                LivraisonService.createLivraison(livraison, livraison.commande.idCmd)
                .then((data) => {
                    loadCommandesData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Creé', life: 3000 })
                })

            setLivraisonDialog(false);
            setLivraison(emptyLivraison);
        }
    };
    
    const editCommande = (commande) => {
        setCommande({ ...commande });
        setCommandeDialog(true);
    };

    const confirmDeleteCommande = (commande) => {
        setCommande(commande);
        setDeleteCommandeDialog(true);
    };

    const deleteCommande = () => {
        CommandeService.deleteCommande(commande.idCmd)
            .then(() => {
                loadCommandesData();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commande Supprimé', life: 3000 });
            })

        setDeleteCommandeDialog(false);
        setCommande(emptyCommande);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCommandesDialog(true);
    };

    const deleteSelectedCommandes = () => {
        const promises = selectedCommandes.map((cmd) => {
            return CommandeService.deleteCommande(cmd.idCmd);
        });
    
        Promise.all(promises)
            .then(() => {
                // After all items are successfully deleted, refresh the data
                return loadCommandesData();
            })
            .then(() => {
                // Clear the selected items and hide the delete dialog
                setSelectedCommandes(null);
                setDeleteCommandesDialog(false);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commandes Supprimés', life: 3000 });
            })
            .catch((error) => {
                console.error('Error deleting selected items', error);
                // Handle error if necessary
            });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _commande = { ...commande };

        _commande[`${name}`] = val;

        setCommande(_commande);
    };

    const onInputChange2 = (e, name) => {
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
                <Button label="Supprimer" icon="pi pi-trash" raised severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCommandes || !selectedCommandes.length} />
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

    const bonCmdAction = () => {
        return (
            <fragment>
                <Button label='Bon Cmd' icon="pi pi-download" rounded className="mr-2" />
            </fragment>
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
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editCommande(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteCommande(rowData)} />
            </fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {
        let tag;
          if(rowData.status === "CREATED") {
            tag = <Tag value="CREÉ" severity={getSeverity(rowData)} />;
          } else if (rowData.status === "PENDING") {
            tag = <Tag value="EN ATTENTE" severity={getSeverity(rowData)} />;
          } else if (rowData.status === "DELIVERED") {
            tag = <Tag value="LIVRÉ" severity={getSeverity(rowData)} />;
          }else {
            tag = <Tag value="ANNULÉ" severity={getSeverity(rowData)} />;
          }
          return tag;
      };

    const selectedMaterielTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.model}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const materielOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.model}</div>
            </div>
        );
    };

    const selectedPrestataireTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.raisonSocial}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const prestataireOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.raisonSocial}</div>
            </div>
        );
    };

    const selectedEtablissementTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const EtablissementOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const allowExpansion = (rowData) => {
        return true;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-2">
                <div className="formgrid grid">
                    <div className="field col">
                        <h4>Livraisons du :  {data.numBonCmd}</h4>
                    </div>
                    <div className="field col-3">
                        <Button label="Ajouter une Livraison" icon="pi pi-plus" raised severity="success" onClick={() => openNew2(data)}/>
                    </div>
                </div>
                <DataTable value={data.livraisonList}>
                    <Column field="bonLiv" header="N° BL" />
                    <Column field="date" header="Date" sortable />
                    <Column field="quantity" header="Quantité" sortable />
                    <Column field="" header="Bon Livraison" body={bonLivAction}  />
                </DataTable>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Commandes</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
            </span>
        </div>
    );
    const commandeDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveCommande} />
        </fragment>
    );

    const livraisonDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveLivraison} />
        </fragment>
    );
    const deleteCommandeDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteCommandeDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteCommande} />
        </fragment>
    );
    const deleteCommandesDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteCommandesDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedCommandes} />
        </fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable value={commandes} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate} selection={selectedCommandes} onSelectionChange={(e) => setSelectedCommandes(e.value)}
                    dataKey="idCmd" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} commandes" globalFilter={globalFilter}  header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column selectionMode="multiple" exportable={false} />
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="numBonCmd" header="N° BC" />
                <Column field="date" header="Date" sortable/>
                <Column field="quantity" header="Quantité" sortable />
                <Column field="" header="Status" body={statusBodyTemplate} />
                <Column field="materiel.model" header="Matériel" />
                <Column field="materiel.typeMateriel.name" header="Type Matériel" />
                <Column field="prestataire.raisonSocial" header="Prestataire" />
                <Column field="etablissement.name" header="Etablissement" />
                <Column field="" header="Bon Commande" body={bonCmdAction}  />
                <Column body={actionBodyTemplate} exportable={false}  />
            </DataTable>
            </div>

            <Dialog visible={commandeDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Matériel Détails" modal className="p-fluid" footer={commandeDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="date" className="font-bold">
                        Date
                    </span>
                    <Calendar dateFormat='dd/mm/yy' placeholder='Date du Commande' value={commande.date} onChange={(e) => onInputChange(e, "date")}  required autoFocus className={classNames({ 'p-invalid': submitted && !commande.date })}/>
                    {submitted && !commande.date && <small className="p-error">Date is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="numBonCmd" className="font-bold">
                        N° Bon Commnade
                    </span>
                    <InputText placeholder='N° Bon Commnade' id="numBonCmd" value={commande.numBonCmd} onChange={(e) => onInputChange(e, "numBonCmd")} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.numBonCmd })} />
                    {submitted && !commande.numBonCmd && <small className="p-error">N° Bon Commnade is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="materiel" className="font-bold">
                        Materiel
                    </span>
                    <Dropdown value={commande.materiel} onChange={(e) => onInputChange(e, "materiel")} options={materiels} optionLabel="model" placeholder="Select a Materiel" 
                            filter valueTemplate={selectedMaterielTemplate} itemTemplate={materielOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.materiel })} />
                    {submitted && !commande.materiel && <small className="p-error">Materiel is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="prestataire" className="font-bold">
                        Prestataire
                    </span>
                    <Dropdown value={commande.prestataire} onChange={(e) => onInputChange(e, "prestataire")} options={prestataires} optionLabel="raisonSocial" placeholder="Select a Prestataire" 
                            filter valueTemplate={selectedPrestataireTemplate} itemTemplate={prestataireOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.prestataire })} />
                    {submitted && !commande.prestataire && <small className="p-error">Prestataire is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="etablissement" className="font-bold">
                        Etablissement
                    </span>
                    <Dropdown value={commande.etablissement} onChange={(e) => onInputChange(e, "etablissement")} options={etablissements} optionLabel="name" placeholder="Select an Etablissement" 
                            filter valueTemplate={selectedEtablissementTemplate} itemTemplate={EtablissementOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.etablissement })} />
                    {submitted && !commande.etablissement && <small className="p-error">Etablissement is required.</small>}
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <span htmlFor="quantity" className="font-bold">
                            Quantité
                        </span>
                        <InputNumber id="quantity" value={commande.quantity} onValueChange={(e) => onInputChange(e, "quantity")} required/>
                        {submitted && !commande.quantity && <small className="p-error">Quantité is required.</small>}
                    </div>
                    <div className="field col">
                        <span htmlFor="bc" className="font-bold">
                            BonCmd
                        </span>
                        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={livraisonDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Livraison Détails" modal className="p-fluid" footer={livraisonDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="date" className="font-bold">
                        Date
                    </span>
                    <Calendar placeholder="entrer la date" value={livraison.date} onChange={(e) => onInputChange2(e, 'date')}  required autoFocus className={classNames({ 'p-invalid': submitted && !livraison.date })}/>
                </div>  
                <div className="field">
                    <span htmlFor="bonLiv" className="font-bold">
                        N° BL
                    </span>
                    <InputText value={livraison.bonLiv} onChange={(e) => onInputChange2(e, 'bonLiv')}  placeholder="Bon Livraison"  required autoFocus className={classNames({ 'p-invalid': submitted && !livraison.bonLiv })} />
                </div> 
                <div className="formgrid grid">
                    <div className="field col">
                        <span htmlFor="quantity" className="font-bold">
                            Quantité
                        </span>
                        <InputNumber placeholder='quantités' id="quantity" value={livraison.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} mode="decimal" required autoFocus className={classNames({ 'p-invalid': submitted && livraison.quantity <= 0 })} />
                    </div>
                    <div className="field col">
                            <span htmlFor="bl" className="font-bold">
                                BonLiv
                            </span>
                            <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteCommandeDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCommandeDialogFooter} onHide={hideDeleteCommandeDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {commande && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{commande.numBonCmd}</b> ?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteCommandesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteCommandesDialogFooter} onHide={hideDeleteCommandesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {commande && <span>Vous Voulez Vraiment Effectuer La Suppression ?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        