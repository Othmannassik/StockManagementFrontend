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
import { PrestataireService } from '../services/PrestataireService';


export default function MaterielsDemo() { 
    const emptyPrestataire = {
        id: null,
        model: '',
        Email:'',
        Tel: null,
        nbcmd: 0,
        adresse:'',
    };

    const [prestataires, setPrestataires] = useState(null);
    const [prestataireDialog, setPrestataireDialog] = useState(false);
    const [deletePrestataireDialog, setDeletePrestataireDialog] = useState(false);
    const [deletePrestatairesDialog, setDeletePrestatairesDialog] = useState(false);
    const [prestataire, setPrestataire] = useState(emptyPrestataire);
    const [selectedPrestataires, setSelectedPrestataires] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        PrestataireService.getPrestataires().then((data) => setPrestataires(data));
    }, []);


    const openNew = () => {
        setPrestataire(emptyPrestataire);
        setSubmitted(false);
        setPrestataireDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPrestataireDialog(false);
    };

    const hideDeletePrestataireDialog = () => {
        setDeletePrestataireDialog(false);
    };

    const hidePrestatairesDialog = () => {
        setDeletePrestatairesDialog(false);
    };

    const savePrestataire = () => {
        setSubmitted(true);

        if (prestataire.name.trim()) {
            const _prestataires = [...prestataires];
            const _prestataire = { ...prestataires };

            if (prestataire.id) {
                const index = findIndexById(prestataire.id);

                _prestataires[index] = _prestataire;
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Materiel Modifié', life: 3000 });
            } else {
                _prestataire.id = createId();
                _prestataire.image = 'product-placeholder.svg';
                _prestataires.push(_prestataire);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Materiel Creé', life: 3000 });
            }

            setPrestataires(_prestataires);
            setPrestataireDialog(false);
            setPrestataire(emptyPrestataire);
        }
    };

    const editPrestataire = (prestataire) => {
        setPrestataire({ ...prestataire });
        setPrestataireDialog(true);
    };

    const confirmDeletePrestataire = (prestataire) => {
        setPrestataire(prestataire);
        setDeletePrestataireDialog(true);
    };

    const deletePrestataire = () => {
        const _prestataires = prestataires.filter((val) => val.id !== prestataire.id);

        setPrestataires(_prestataires);
        setDeletePrestataireDialog(false);
        setPrestataire(emptyPrestataire);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Prestataire Supprimé', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < prestataires.length; i+1) {
            if (prestataires[i].id === id) {
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
        setDeletePrestatairesDialog(true);
    };

    const deleteSelectedPrestataires = () => {
        const _prestataires = prestataires.filter((val) => !selectedPrestataires.includes(val));

        setPrestataires(_prestataires);
        setDeletePrestatairesDialog(false);
        setSelectedPrestataires(null);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Prestataire Supprimé', life: 3000 });
    };

    const onCategoryChange = (e) => {
        const _prestataire = { ...prestataire };

        _prestataire.category = e.value;
        setPrestataire(_prestataire);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _prestataire = { ...prestataire };

        _prestataire[`${name}`] = val;

        setPrestataire(_prestataire);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        const _prestataire = { ...prestataire };

        _prestataire[`${name}`] = val;

        setPrestataire(_prestataire);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Ajouter" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPrestataires || !selectedPrestataires.length} />
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
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editPrestataire(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeletePrestataire(rowData)} />
            </fragment>
        );
    };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Prestataires</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
            </span>
        </div>
    );
    const prestataireDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={savePrestataire} />
        </fragment>
    );
    const deletePrestataireDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeletePrestataireDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deletePrestataire} />
        </fragment>
    );
    const deletePrestatairesDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeletePrestataireDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedPrestataires} />
        </fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable ref={dt} value={prestataires} selection={selectedPrestataires} onSelectionChange={(e) => setSelectedPrestataires(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} materiels" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false} />
                    <Column field="Raison Social" header="Raison Social" sortable style={{ minWidth: '12rem' }} />
                    <Column field="Email" header="Email" style={{ minWidth: '16rem' }} />
                    <Column field="Téléphone" header="Téléphone" />
                    <Column field="Adresse" header="adresse" sortable style={{ minWidth: '8rem' }} />
                    <Column field="nbcmd" header="nbcmd"  style={{ minWidth: '12rem' }} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>

            <Dialog visible={prestataireDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Matériel Détails" modal className="p-fluid" footer={prestataireDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="Raison Social" className="font-bold">
                        Raison Social
                    </span>
                    <InputText placeholder='Raison Social' id="model" value={prestataire.model} onChange={(e) => onInputChange(e, 'model')} required autoFocus className={classNames({ 'p-invalid': submitted && !prestataire.model })} />
                    {submitted && !prestataire.model && <small className="p-error">Raison Social is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="Email" className="font-bold">
                        Email
                    </span>
                    <InputText placeholder='Email' id="Email" value={prestataire.Email} onChange={(e) => onInputChange(e, 'Email')} required autoFocus className={classNames({ 'p-invalid': submitted && !prestataire.Email })} />
                    {submitted && !prestataire.Email && <small className="p-error">Email is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="Téléphone" className="font-bold">
                        Téléphone
                    </span>
                    <InputText placeholder='Téléphone' id="Téléphone" value={prestataire.Téléphone} onChange={(e) => onInputChange(e, 'Téléphone')} required autoFocus className={classNames({ 'p-invalid': submitted && !prestataire.Téléphone })} />
                    {submitted && !prestataire.Téléphone && <small className="p-error">Téléphone is required.</small>}
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <span htmlFor="Adresse" className="font-bold">
                            Adresse
                        </span>
                        <InputNumber placeholder='Adresse' id="Adresse" value={prestataire.Adresse} onChange={(e) => onInputNumberChange(e, 'Adresse')} required autoFocus className={classNames({ 'p-invalid': submitted && !prestataire.Adresse })}/>
                        {submitted && !prestataire.Adresse && <small className="p-error">Adresse is required.</small>}
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deletePrestataireDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletePrestataireDialogFooter} onHide={hideDeletePrestataireDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {prestataire && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{prestataire.name}</b> ?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deletePrestatairesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletePrestatairesDialogFooter} onHide={hideDeletePrestataireDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {prestataire && <span>Vous Voulez Vraiment Effectuer La Suppression ?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        