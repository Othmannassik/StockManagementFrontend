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
import { Dropdown } from 'primereact/dropdown';
import { MaterielService } from '../services/MaterielService';
import { EtablissementService } from '../services/EtablissementService';
import { TypeMaterielService } from '../services/TypeMaterielService';


export default function Materiels() {
    const emptyMateriel = {
        idMat: null,
        model: '',
        numSerie: "",
        inventaireCih: '',
        typeMaterielDTO : null,
        etablissementDTO: null,
    };

    const [materiels, setMateriels] = useState(null);
    const [typeMateriels, setTypeMateriels] = useState(null);
    const [etablissements, setEtablissements] = useState(null);
    const [materielDialog, setMaterielDialog] = useState(false);
    const [deleteMaterielDialog, setDeleteMaterielDialog] = useState(false);
    const [deleteMaterielsDialog, setDeleteMaterielsDialog] = useState(false);
    const [materiel, setMateriel] = useState(emptyMateriel);
    const [selectedMateriels, setSelectedMateriels] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const loadMaterielData = () => {
        MaterielService.getMateriels().then((data) => setMateriels(data));
    }

    useEffect(() => {
        loadMaterielData();

        TypeMaterielService.getTypeMateriels()
            .then((data) => setTypeMateriels(data))

        EtablissementService.getEtablissements()
            .then((data) => setEtablissements(data))
    }, []);


    const openNew = () => {
        setMateriel(emptyMateriel);
        setSubmitted(false);
        setMaterielDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMaterielDialog(false);
    };

    const hideDeleteMaterielDialog = () => {
        setDeleteMaterielDialog(false);
    };

    const hideDeleteMaterielsDialog = () => {
        setDeleteMaterielsDialog(false);
    };

    const saveMateriel = () => {
        setSubmitted(true);

        if (materiel.inventaireCih.trim() && materiel.model.trim()) {

            if (materiel.idMat) {
                MaterielService.updateMateriel(materiel.idMat, materiel)
                .then((data) => {
                    loadMaterielData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériel Modifié', life: 3000 })
                })                
            } else {
                MaterielService.createMateriel(materiel)
                .then((data) => {
                    loadMaterielData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériel Creé', life: 3000 })
                })
            }

            setMaterielDialog(false);
            setMateriel(emptyMateriel);
        }
    };
      
    const editMateriel = (materiel) => {
        setMateriel({ ...materiel });
        setMaterielDialog(true);
    };

    const confirmDeleteMateriel = (materiel) => {
        setMateriel(materiel);
        setDeleteMaterielDialog(true);
    };

    const deleteMateriel = () => {
        console.log(materiel);
        MaterielService.deleteMateriel(materiel.idMat)
            .then(() => {
                loadMaterielData();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériel Supprimé', life: 3000 });
            })

        setDeleteMaterielDialog(false);
        setMateriel(emptyMateriel);
    };

    const findIndexById = (idMat) => {
        let index = -1;

        for (let i = 0; i < materiels.length; i+1) {
            if (materiels[i].idMat === idMat) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let idMat = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i+1) {
            idMat += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return idMat;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteMaterielsDialog(true);
    };

    const deleteSelectedMateriels = () => {
        const promises = selectedMateriels.map((mat) => {
            return MaterielService.deleteMateriel(mat.idMat);
        });
    
        Promise.all(promises)
            .then(() => {
                // After all items are successfully deleted, refresh the data
                return loadMaterielData();
            })
            .then(() => {
                // Clear the selected items and hide the delete dialog
                setSelectedMateriels(null);
                setDeleteMaterielsDialog(false);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériaux Supprimés', life: 3000 });
            })
            .catch((error) => {
                console.error('Error deleting selected items', error);
                // Handle error if necessary
            });
    };

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

    const onCategoryChange = (e) => {
        const _materiel = { ...materiel };

        _materiel.category = e.value;
        setMateriel(_materiel);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _materiel = { ...materiel };

        _materiel[`${name}`] = val;

        setMateriel(_materiel);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        const _materiel = { ...materiel };

        _materiel[`${name}`] = val;

        setMateriel(_materiel);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Ajouter" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedMateriels || !selectedMateriels.length} />
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
            <>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editMateriel(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteMateriel(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Matériels</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
            </span>
        </div>
    );
    const materielDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveMateriel} />
        </>
    );
    const deleteMaterielDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteMaterielDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteMateriel} />
        </>
    );
    const deleteMaterielsDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteMaterielsDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedMateriels} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable ref={dt} value={materiels} selection={selectedMateriels} onSelectionChange={(e) => setSelectedMateriels(e.value)}
                        dataKey="idMat"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} materiels" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false} />
                    <Column field="model" header="Modèle" sortable style={{ minWidth: '12rem' }} />
                    <Column field="numSerie" header="N° Série" style={{ minWidth: '12rem' }} />
                    <Column field="inventaireCih" header="Inventaire CIH" />
                    <Column field="typeMaterielDTO.name" header="Type Matériel" />
                    <Column field="etablissementDTO.name" header="Etablissement" />
                    {/* <Column field="quantity" header="Quantité" sortable style={{ minWidth: '8rem' }} /> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>

            <Dialog visible={materielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Matériel Détails" modal className="p-fluid" footer={materielDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="model" className="font-bold">
                        Modèle
                    </span>
                    <InputText placeholder='Modèle' id="model" value={materiel.model} onChange={(e) => onInputChange(e, 'model')} required autoFocus className={classNames({ 'p-invalid': submitted && !materiel.model })} />
                    {submitted && !materiel.model && <small className="p-error">Model is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="numSerie" className="font-bold">
                        N° Série
                    </span>
                    <InputText placeholder='N° Série' id="numSerie" value={materiel.numSerie} onChange={(e) => onInputChange(e, 'numSerie')} required autoFocus className={classNames({ 'p-invalid': submitted && !materiel.numSerie })} />
                    {submitted && !materiel.numSerie && <small className="p-error">N° Série is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="inventaireCih" className="font-bold">
                        Inventaire CIH
                    </span>
                    <InputText placeholder='Inventaire Cih' id="inventaireCih" value={materiel.inventaireCih} onChange={(e) => onInputChange(e, 'inventaireCih')} required autoFocus className={classNames({ 'p-invalid': submitted && !materiel.inventaireCih })} />
                    {submitted && !materiel.inventaireCih && <small className="p-error">Inventaire Cih is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="typeMateriel" className="font-bold">
                        Type Matériel
                    </span>
                    <Dropdown value={materiel.typeMaterielDTO} onChange={(e) => onInputChange(e, "typeMaterielDTO")} options={typeMateriels} optionLabel="name" placeholder="Select a Type" 
                            filter valueTemplate={selectedTypeMaterielTemplate} itemTemplate={typeMaterielOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !materiel.typeMaterielDTO })} />
                    {submitted && !materiel.typeMaterielDTO && <small className="p-error">Type Matériel is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="etablissement" className="font-bold">
                        Etablissement
                    </span>
                    <Dropdown value={materiel.etablissementDTO} onChange={(e) => onInputChange(e, "etablissementDTO")} options={etablissements} optionLabel="name" placeholder="Select an Etablissement" 
                            filter valueTemplate={selectedEtablissementTemplate} itemTemplate={EtablissementOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !materiel.etablissementDTO })} />
                    {submitted && !materiel.etablissementDTO && <small className="p-error">Etablissement is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteMaterielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteMaterielDialogFooter} onHide={hideDeleteMaterielDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {materiel && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{materiel.model}</b> ?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteMaterielsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteMaterielsDialogFooter} onHide={hideDeleteMaterielsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {materiel && <span>Vous Voulez Vraiment Effectuer La Suppression ?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        