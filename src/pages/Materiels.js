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
import { MaterielService } from '../services/MaterielService';


export default function Materiels() {
    const emptyMateriel = {
        idMat: null,
        model: '',
        numSerie: null,
        inventaireCih: '',
        quantity: 0,
    };

    const [materiels, setMateriels] = useState(null);
    const [materielDialog, setMaterielDialog] = useState(false);
    const [deleteMaterielDialog, setDeleteMaterielDialog] = useState(false);
    const [deleteMaterielsDialog, setDeleteMaterielsDialog] = useState(false);
    const [materiel, setMateriel] = useState(emptyMateriel);
    const [selectedMateriels, setSelectedMateriels] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        MaterielService.getMateriels().then((data) => setMateriels(data));
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
      
        if (materiel.model.trim() && materiel.numSerie.trim() && materiel.inventaireCih.trim() && materiel.quantity > 0) {
          const _materiels = [...materiels];
          const _materiel = { ...materiel };
      
          if (materiel.idMat) {
            MaterielService.updateMateriel(_materiel)
              .then(() => {
                const index = _materiels.findIndex((item) => item.idMat === _materiel.idMat);
                _materiels[index] = _materiel;
                setMateriels(_materiels);
                setMaterielDialog(false);
                setMateriel(emptyMateriel);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Materiel Updated', life: 3000 });
            })
              .catch((error) => {
                console.error('Error updating Materiel:', error);
              });
          } else {
            // Ajout d'un nouveau matériel
            MaterielService.createMateriel(_materiel)
              .then((response) => {
                const lastIdMat = Math.max(..._materiels.map((item) => item.idMat), 0);
                _materiel.idMat = lastIdMat + 1;
                _materiels.push(_materiel);
                setMateriels(_materiels);
                setMaterielDialog(false);
                setMateriel(emptyMateriel);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Materiel Created', life: 3000 });
              })
              .catch((error) => {
                console.error('Error creating Materiel:', error);
              });
          }
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
        const _materiels = materiels.filter((val) => val.idMat !== materiel.idMat);

        setMateriels(_materiels);
        setDeleteMaterielDialog(false);
        setMateriel(emptyMateriel);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériel Supprimé', life: 3000 });
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
        const _materiels = materiels.filter((val) => !selectedMateriels.includes(val));

        setMateriels(_materiels);
        setDeleteMaterielsDialog(false);
        setSelectedMateriels(null);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériaux Supprimés', life: 3000 });
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

    const statusBodyTemplate = (rowData) => {
      let tag;
        if(rowData.quantity < 5) {
          tag = <Tag value="In Stock" severity={getSeverity(rowData)} />;
        } else if (rowData.quantity < 10) {
          tag = <Tag value="Warning" severity={getSeverity(rowData)} />;
        } else {
          tag = <Tag value="Out of Stock" severity={getSeverity(rowData)} />;
        }
        return tag;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editMateriel(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteMateriel(rowData)} />
            </>
        );
    };

    const getSeverity = (materiel) => {
      let status;
      if(materiel.quantity < 5) {
        status = "danger";
      } else if (materiel.quantity < 10) {
        status = "warning";
      } else {
        status = "success";
      }
      return status;
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
                    <Column field="quantity" header="Quantité" sortable style={{ minWidth: '8rem' }} />
                    <Column field="" header="Status" body={statusBodyTemplate} style={{ minWidth: '12rem' }} />
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
                <div className="formgrid grid">
                    <div className="field col">
                        <span htmlFor="quantity" className="font-bold">
                            Quantité
                        </span>
                        <InputNumber id="quantity" value={materiel.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteMaterielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteMaterielDialogFooter} onHide={hideDeleteMaterielDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {materiel && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{materiel.name}</b> ?
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
        