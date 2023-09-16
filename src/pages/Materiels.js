import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Avatar, AvatarGroup } from '@mui/material';
import { TypeMaterielService } from '../services/TypeMaterielService';
import { MaterielService } from '../services/MaterielService';


export default function MaterielsDemo() {
    const emptyMateriel = {
        idMat: null,
        model: '',
        quantity: 0,
        typeMateriel: "",
    };

    const [Materiels, setMateriels] = useState(null);
    const [Materiel, setMateriel] = useState(emptyMateriel);
    const [MaterielDetail, setMaterielDetail] = useState(null);
    const [typeMateriels, setTypeMateriels] = useState(null);
    const [MaterielDialog, setMaterielDialog] = useState(false);
    const [deleteMaterielDialog, setDeleteMaterielDialog] = useState(false);
    const [deleteMaterielDetailDialog, setDeleteMaterielDetailDialog] = useState(false);
    const [deleteMaterielsDialog, setDeleteMaterielsDialog] = useState(false);
    const [selectedMateriels, setSelectedMateriels] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [materielDetailDialogVisible, setMaterielDetailDialogVisible] = useState(false);
    const [materielDetails, setMaterielDetails] = useState(null);
    const [aff, setAff] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const loadMaterielData = () => {
        MaterielService.getMateriels().then((data) => setMateriels(data));
    }

    useEffect(() => {
        loadMaterielData();

        TypeMaterielService.getTypeMateriels()
            .then((data) => setTypeMateriels(data))
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
        setDeleteMaterielDetailDialog(false);
    };

    const hideDeleteMaterielsDialog = () => {
        setDeleteMaterielsDialog(false);
    };

    const saveMateriel = () => {
        setSubmitted(true);

        if (Materiel.model.trim()) {

            if (Materiel.idMat) {
                MaterielService.updateMateriel(Materiel.idMat, Materiel)
                .then((data) => {
                    loadMaterielData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Materiel Modifié', life: 3000 })
                })                
            } else {
                MaterielService.createMateriel(Materiel)
                .then((data) => {
                    loadMaterielData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Materiel Creé', life: 3000 })
                })
            }

            setMaterielDialog(false);
            setMateriel(emptyMateriel);
        }
    };

    const editMateriel = (Materiel) => {
        setMateriel({ ...Materiel });
        setMaterielDialog(true);
    };

    const confirmDeleteMateriel = (Materiel) => {
        setMateriel(Materiel);
        setDeleteMaterielDialog(true);
    };

    const confirmDeleteMaterielDetail = (MaterielDetail) => {
        setMaterielDetail(MaterielDetail);
        setDeleteMaterielDetailDialog(true);
    };

    const deleteMaterielDetail = () => {
        MaterielService.deleteMaterielDetail(MaterielDetail.idMatDet)
            .then(() => {
                MaterielService.getMaterielDetailsByMateriel(Materiel.idMat)
                .then((data) => {
                    setMaterielDetails(data)
                    setDeleteMaterielDetailDialog(false);
                    loadMaterielData();
                });
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Materiel Supprimé', life: 3000 });
            })

        setDeleteMaterielDialog(false);
        setMateriel(emptyMateriel);
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
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Materiels Supprimés', life: 3000 });
            })
            .catch((error) => {
                console.error('Error deleting selected items', error);
                // Handle error if necessary
            });
    };
    

    const selectedTypeMaterielsTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const typeMaterielsOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _Materiel = { ...Materiel };

        _Materiel[`${name}`] = val;

        setMateriel(_Materiel);
    };    

    const materielDetailButton = (rowData) => {
        return <Button label="Liste Matériels" rounded icon="pi pi-external-link" onClick={() => openMaterielDetailDialog(rowData)} />;
    };

    const openMaterielDetailDialog = (rowData) => {
        MaterielService.getMaterielDetailsByMateriel(rowData.idMat)
            .then((data) => {
                setMaterielDetails(data)
                setMaterielDetailDialogVisible(true);
                setMateriel(rowData);
            });
    };

    const materielDialogFooterTemplate = () => {
        return <Button label="Ok" icon="pi pi-check" onClick={() => setMaterielDetailDialogVisible(false)} />;
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
            <fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editMateriel(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteMateriel(rowData)} />
            </fragment>
        );
    };

    const actionBodyTemplate2 = (rowData) => {
        return (
            <fragment>
                <Button label='Supprimer' icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteMaterielDetail(rowData)} />
            </fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Materiels</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
            </span>
        </div>
    );
    const MaterielDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveMateriel} />
        </fragment>
    );

    const deleteMaterielDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteMaterielDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteMaterielDetail} />
        </fragment>
    );

    const deleteMaterielDetailDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteMaterielDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteMaterielDetail} />
        </fragment>
    );

    const deleteMaterielsDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteMaterielsDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedMateriels} />
        </fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable ref={dt} value={Materiels} selection={selectedMateriels} onSelectionChange={(e) => setSelectedMateriels(e.value)}
                        dataKey="idMat"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Materiels" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false} />
                    <Column field="model" header="Modèle" sortable style={{ minWidth: '10rem' }} />
                    <Column field="quantity" header="Quantité" sortable style={{ minWidth: '10rem' }} />
                    <Column field="typeMateriel.name" header="Type" />
                    <Column field="" header="Matériels" body={materielDetailButton} style={{ minWidth: '12rem' }} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>

            <Dialog visible={materielDetailDialogVisible} style={{ width: '60vw' }} maximizable
                    modal contentStyle={{ height: '500px' }} onHide={() => setMaterielDetailDialogVisible(false)} footer={materielDialogFooterTemplate}>
                <DataTable value={materielDetails} scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }} removableSort>
                    <Column field="materielDTO.model" header="Modèle" />
                    <Column field="numSerie" header="N° Série" />
                    <Column field="inventaireCih" header="Inventaire Cih" />
                    <Column field="usageCount" header="Nbr D'affectation" sortable/>
                    <Column body={actionBodyTemplate2} exportable={false} />
                </DataTable>
            </Dialog>

            <Dialog visible={MaterielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Materiel Détails" modal className="p-fluid" footer={MaterielDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="model" className="font-bold">
                        Modèle
                    </span>
                    <InputText value={Materiel.model} placeholder='Modèle' id="model" onChange={(e) => onInputChange(e, 'model')} required autoFocus className={classNames({ 'p-invalid': submitted && !Materiel.model })} />
                    {submitted && !Materiel.model && <small className="p-error">Modèle is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="typeMateriel" className="font-bold">
                        Type Matériel
                    </span>
                    <Dropdown value={Materiel.typeMateriel} onChange={(e) => onInputChange(e, "typeMateriel")} options={typeMateriels} optionLabel="name" placeholder="Select a Type " 
                            filter valueTemplate={selectedTypeMaterielsTemplate} itemTemplate={typeMaterielsOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !Materiel.typeMateriel })} />
                    {submitted && !Materiel.typeMateriel && <small className="p-error">Type Matériel is required.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteMaterielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteMaterielDialogFooter} onHide={hideDeleteMaterielDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Materiel && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{Materiel.model}</b> ?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteMaterielDetailDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteMaterielDetailDialogFooter} onHide={hideDeleteMaterielDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {MaterielDetail && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{MaterielDetail.materielDTO.model} : {MaterielDetail.inventaireCih}</b> ?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteMaterielsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteMaterielsDialogFooter} onHide={hideDeleteMaterielsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Materiel && <span>Vous Voulez Vraiment Effectuer La Suppression ?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        