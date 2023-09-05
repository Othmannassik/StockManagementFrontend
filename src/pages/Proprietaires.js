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
import { ProprietaireService } from '../services/ProprietaireService';


export default function ProprietairesDemo() {
    const emptyProprietaire = {
        id: null,
        model: '',
        numSerie: null,
        inventaireCih: '',
        quantity: 0,
    };

    const [Proprietaires, setProprietaires] = useState(null);
    const [ProprietaireDialog, setProprietaireDialog] = useState(false);
    const [deleteProprietaireDialog, setDeleteProprietaireDialog] = useState(false);
    const [deleteProprietairesDialog, setDeleteProprietairesDialog] = useState(false);
    const [Proprietaire, setProprietaire] = useState(emptyProprietaire);
    const [selectedProprietaires, setSelectedProprietaires] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [materielDialogVisible, setMaterielDialogVisible] = useState(false);
    const [selectedProprietaire, setSelectedProprietaire] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        ProprietaireService.getProprietaires().then((data) => setProprietaires(data));
    }, []);


    const openNew = () => {
        setProprietaire(emptyProprietaire);
        setSubmitted(false);
        setProprietaireDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProprietaireDialog(false);
    };

    const hideDeleteProprietaireDialog = () => {
        setDeleteProprietaireDialog(false);
    };

    const hideDeleteProprietairesDialog = () => {
        setDeleteProprietairesDialog(false);
    };

    const saveProprietaire = () => {
        setSubmitted(true);

        if (Proprietaire.name.trim()) {
            const _Proprietaires = [...Proprietaires];
            const _Proprietaire = { ...Proprietaires };

            if (Proprietaire.id) {
                const index = findIndexById(Proprietaire.id);

                _Proprietaires[index] = _Proprietaire;
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Proprietaire Modifié', life: 3000 });
            } else {
                _Proprietaire.id = createId();
                _Proprietaire.image = 'product-placeholder.svg';
                _Proprietaires.push(_Proprietaire);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Proprietaire Creé', life: 3000 });
            }

            setProprietaires(_Proprietaires);
            setProprietaireDialog(false);
            setProprietaire(emptyProprietaire);
        }
    };

    const editProprietaire = (Proprietaire) => {
        setProprietaire({ ...Proprietaire });
        setProprietaireDialog(true);
    };

    const confirmDeleteProprietaire = (Proprietaire) => {
        setProprietaire(Proprietaire);
        setDeleteProprietaireDialog(true);
    };

    const deleteProprietaire = () => {
        const _Proprietaires = Proprietaires.filter((val) => val.id !== Proprietaire.id);

        setProprietaires(_Proprietaires);
        setDeleteProprietaireDialog(false);
        setProprietaire(emptyProprietaire);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Proprietaire Supprimé', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < Proprietaires.length; i+1) {
            if (Proprietaires[i].id === id) {
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
        setDeleteProprietairesDialog(true);
    };

    const deleteSelectedProprietaires = () => {
        const _Proprietaires = Proprietaires.filter((val) => !selectedProprietaires.includes(val));

        setProprietaires(_Proprietaires);
        setDeleteProprietairesDialog(false);
        setSelectedProprietaires(null);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériaux Supprimés', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _Proprietaire = { ...Proprietaire };

        _Proprietaire[`${name}`] = val;

        setProprietaire(_Proprietaire);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        const _Proprietaire = { ...Proprietaire };

        _Proprietaire[`${name}`] = val;

        setProprietaire(_Proprietaire);
    };

    const materielButton = (selectedProprietaire) => {
        return <Button label="Matériels" rounded icon="pi pi-external-link" onClick={() => openMaterielDialog(selectedProprietaire)} />;
    };

    const openMaterielDialog = (selectedProprietaire) => {
        setSelectedProprietaire(selectedProprietaire);
        setMaterielDialogVisible(true);
    };

    const materielDialogFooterTemplate = () => {
        return <Button label="Ok" icon="pi pi-check" onClick={() => setMaterielDialogVisible(false)} />;
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Ajouter" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProprietaires || !selectedProprietaires.length} />
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

    const actionBodyTemplate = (rowData) => {
        return (
            <fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editProprietaire(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteProprietaire(rowData)} />
            </fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Proprietaires</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
            </span>
        </div>
    );
    const ProprietaireDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveProprietaire} />
        </fragment>
    );
    const deleteProprietaireDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteProprietaireDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteProprietaire} />
        </fragment>
    );
    const deleteProprietairesDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteProprietairesDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedProprietaires} />
        </fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable ref={dt} value={Proprietaires} selection={selectedProprietaires} onSelectionChange={(e) => setSelectedProprietaires(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Proprietaires" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false} />
                    <Column field="firstName" header="Prénom" sortable style={{ minWidth: '12rem' }} />
                    <Column field="lastName" header="Nom" sortable style={{ minWidth: '16rem' }} />
                    <Column field="email" header="Email" />
                    <Column field="telephone" header="N° Télephone" style={{ minWidth: '8rem' }} />
                    <Column field="" header="Matériels" body={materielButton} style={{ minWidth: '12rem' }} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>

            <Dialog header="Liste des Matériels" visible={materielDialogVisible} style={{ width: '60vw' }} maximizable
                    modal contentStyle={{ height: '300px' }} onHide={() => setMaterielDialogVisible(false)} footer={materielDialogFooterTemplate}>
                <DataTable value={selectedProprietaire?.materiels} scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}>
                    <Column field="model" header="Matériel" />
                    <Column field="date" header="Date d'Affectation" />
                    <Column field="motif" header="Motif" />
                </DataTable>
            </Dialog>

            <Dialog visible={ProprietaireDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Proprietaire Détails" modal className="p-fluid" footer={ProprietaireDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="firstName" className="font-bold">
                        Prénom
                    </span>
                    <InputText placeholder='Prénom' id="firstName" value={Proprietaire.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !Proprietaire.firstName })} />
                    {submitted && !Proprietaire.firstName && <small className="p-error">Prénom is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="lastName" className="font-bold">
                        Nom
                    </span>
                    <InputText placeholder='Nom' id="lastName" value={Proprietaire.lastName} onChange={(e) => onInputChange(e, 'lastName')} required autoFocus className={classNames({ 'p-invalid': submitted && !Proprietaire.lastName })} />
                    {submitted && !Proprietaire.lastName && <small className="p-error">N° Série is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="email" className="font-bold">
                        Email
                    </span>
                    <InputText type='email' placeholder='email' id="email" value={Proprietaire.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !Proprietaire.email })} />
                    {submitted && !Proprietaire.email && <small className="p-error">Email is required.</small>}
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <span htmlFor="telephone" className="font-bold">
                            Télephone
                        </span>
                        <InputNumber id="telephone" value={Proprietaire.telephone} onValueChange={(e) => onInputNumberChange(e, 'telephone')} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProprietaireDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProprietaireDialogFooter} onHide={hideDeleteProprietaireDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Proprietaire && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{Proprietaire.firstName} {Proprietaire.lastName}</b> ?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProprietairesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProprietairesDialogFooter} onHide={hideDeleteProprietairesDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Proprietaire && <span>Vous Voulez Vraiment Effectuer La Suppression ?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        