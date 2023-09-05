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
import { CommandeService } from '../services/CommandeService';


export default function CommandesDemo() {
    const emptyCommande = {
        id: null,
        numBc: null,
        model: '',
        date: null,
        inventaireCih: '',
        status: "",
        quantity: 0,
        prestataire: '',
        materiel: "",
        typeMateriel: '',
    };

    const [commandes, setCommandes] = useState(null);
    const [commandeDialog, setCommandeDialog] = useState(false);
    const [deleteCommandeDialog, setDeleteCommandeDialog] = useState(false);
    const [deleteCommandesDialog, setDeleteCommandesDialog] = useState(false);
    const [commande, setCommande] = useState(emptyCommande);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedCommandes, setSelectedCommandes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        CommandeService.getCommandesWithLivraisonsSmall().then((data) => setCommandes(data));
    }, []);


    const openNew = () => {
        setCommande(emptyCommande);
        setSubmitted(false);
        setCommandeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCommandeDialog(false);
    };

    const hideDeleteCommandeDialog = () => {
        setDeleteCommandeDialog(false);
    };

    const hideDeleteCommandesDialog = () => {
        setDeleteCommandesDialog(false);
    };

    const saveCommande = () => {
        setSubmitted(true);

        if (commande.name.trim()) {
            const _commandes = [...commandes];
            const _commande = { ...commandes };

            if (commande.id) {
                const index = findIndexById(commande.id);

                _commandes[index] = _commande;
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commande Modifié', life: 3000 });
            } else {
                _commande.id = createId();
                _commande.image = 'product-placeholder.svg';
                _commandes.push(_commande);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commande Creé', life: 3000 });
            }

            setCommandes(_commandes);
            setCommandeDialog(false);
            setCommande(emptyCommande);
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
        const _commandes = commandes.filter((val) => val.id !== commande.id);

        setCommandes(_commandes);
        setDeleteCommandeDialog(false);
        setCommande(emptyCommande);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commande Supprimé', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < commandes.length; i+1) {
            if (commandes[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i+1) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCommandesDialog(true);
    };

    const deleteSelectedCommandes = () => {
        const _commandes = commandes.filter((val) => !selectedCommandes.includes(val));

        setCommandes(_commandes);
        setDeleteCommandesDialog(false);
        setSelectedCommandes(null);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Commandes Supprimés', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _commande = { ...commande };

        _commande[`${name}`] = val;

        setCommande(_commande);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        const _commande = { ...commande };

        _commande[`${name}`] = val;

        setCommande(_commande);
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

    const prestataires = [
        { name: 'Hicham' },
        { name: 'Haitem' },
        { name: 'Soufiane' },
        { name: 'Khalil' },
        { name: 'Adam' },
        { name: 'Akram' },
        { name: 'Bader' },
    ];

    const selectedPrestataireTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const prestataireOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const typeMateriels = [
        { name: 'Laptop' },
        { name: 'PC Bureau' },
        { name: 'Lecteur NFC' },
        { name: 'Imprimante' },
        { name: 'Scanner' },
        
    ];

    const selectedTypeMaterielTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const typeMaterielOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const Etablissements = [
        { name: 'Agence Anassi' },
        { name: 'Siege Casa' },
        { name: 'DG Khouribga' },
        { name: 'Agence Maarif' },
        
    ];

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
                        <h4>Livraisons du :  {data.numBc}</h4>
                    </div>
                    <div className="field col-3">
                        <Button label="Ajouter une Livraison" icon="pi pi-plus" raised severity="success" />
                    </div>
                </div>
                <DataTable value={data.livraisons}>
                    <Column field="numBl" header="N° BL" />
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
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} commandes" globalFilter={globalFilter}  header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column selectionMode="multiple" exportable={false} />
                <Column expander={allowExpansion} style={{ width: '5rem' }} />
                <Column field="numBc" header="N° BC" />
                <Column field="date" header="Date" sortable/>
                <Column field="quantity" header="Quantité" sortable />
                <Column field="" header="Status" body={statusBodyTemplate} />
                <Column field="prestataire" header="Prestataire" />
                <Column field="materiel" header="Matériel" />
                <Column field="typeMateriel" header="Type Matériel" />
                <Column field="" header="Bon Commande" body={bonCmdAction}  />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>
            </div>

            <Dialog visible={commandeDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Matériel Détails" modal className="p-fluid" footer={commandeDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="date" className="font-bold">
                        Date
                    </span>
                    <Calendar value={commande.date} onChange={(e) => onInputChange(e, 'date')}  required autoFocus className={classNames({ 'p-invalid': submitted && !commande.date })}/>
                    {submitted && !commande.date && <small className="p-error">Date is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="prestataire" className="font-bold">
                        Prestataire
                    </span>
                    <Dropdown value={commande.prestataire} onChange={(e) => onInputChange(e, 'prestataire')} options={prestataires} optionLabel="name" placeholder="Select a Prestataire" 
                            filter valueTemplate={selectedPrestataireTemplate} itemTemplate={prestataireOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.prestataire })} />
                    {submitted && !commande.prestataire && <small className="p-error">Prestataire is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="materiel" className="font-bold">
                        Matériel
                    </span>
                    <InputText placeholder='materiel' id="materiel" value={commande.materiel} onChange={(e) => onInputChange(e, 'materiel')} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.materiel })} />
                    {submitted && !commande.materiel && <small className="p-error">Materiel is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="typeMateriel" className="font-bold">
                        Type Matériel
                    </span>
                    <Dropdown value={commande.typeMateriel} onChange={(e) => onInputChange(e, 'typeMateriel')} options={typeMateriels} optionLabel="name" placeholder="Select a Type" 
                            filter valueTemplate={selectedTypeMaterielTemplate} itemTemplate={typeMaterielOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.typeMateriel })} />
                    {submitted && !commande.typeMateriel && <small className="p-error">Type Matériel is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="etablissement" className="font-bold">
                        Etablissement
                    </span>
                    <Dropdown value={commande.etablissement} onChange={(e) => onInputChange(e, 'etablissement')} options={Etablissements} optionLabel="name" placeholder="Select an Etablissement" 
                            filter valueTemplate={selectedEtablissementTemplate} itemTemplate={EtablissementOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !commande.etablissement })} />
                    {submitted && !commande.etablissement && <small className="p-error">Etablissement is required.</small>}
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <span htmlFor="quantity" className="font-bold">
                            Quantité
                        </span>
                        <InputNumber id="quantity" value={commande.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                    <div className="field col">
                        <span htmlFor="bc" className="font-bold">
                            BonCmd
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
                            Vous Voulez Vraiment Supprimer <b>{commande.numBc}</b> ?
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
        