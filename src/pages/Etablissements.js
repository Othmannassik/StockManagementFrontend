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
import { EtablissementService } from '../services/EtablissementService';

export default function Etablissements() {
    const emptyEtablissement = {
        idEtb: null,
        name: '',
        adresse: '',
        city: '',
        nb_Materiel: 0,
    };

    const [etablissements, setEtablissements] = useState(null);
    const [etablissementDialog, setEtablissementDialog] = useState(false);
    const [deleteEtablissementDialog, setDeleteEtablissementDialog] = useState(false);
    const [deleteEtablissementsDialog, setDeleteEtablissementsDialog] = useState(false);
    const [etablissement, setEtablissement] = useState(emptyEtablissement);
    const [selectedEtablissements, setSelectedEtablissements] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
 
    useEffect(() => {
        loadEtablissements();
    }, []);

    const loadEtablissements = () => {
        EtablissementService.getEtablissements().then((data) => setEtablissements(data));
    }

    const openNew = () => {
        setEtablissement(emptyEtablissement);
        setSubmitted(false);
        setEtablissementDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEtablissementDialog(false);
    };

    const hideDeleteEtablissementDialog = () => {
        setDeleteEtablissementDialog(false);
    };

    const hideDeleteEtablissementsDialog = () => {
        setDeleteEtablissementsDialog(false);
    };

    const saveEtablissement = () => {
        setSubmitted(true);

        if (etablissement.name.trim() && etablissement.adresse.trim() && etablissement.city.trim()) {

            if (etablissement.idEtb) {
                EtablissementService.updateEtablissement(etablissement.idEtb, etablissement)
                .then((data) => {
                    loadEtablissements();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Etablissement Modifié', life: 3000 })
                })                
            } else {
                EtablissementService.createEtablissement(etablissement)
                .then((data) => {
                    loadEtablissements();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Etablissement Creé', life: 3000 })
                })
            }

            setEtablissementDialog(false);
            setEtablissement(emptyEtablissement);
        }
    };

    const editEtablissement = (etablissement) => {
        setEtablissement({ ...etablissement });
        setEtablissementDialog(true);
    };

    const confirmDeleteEtablissement = (etablissement) => {
        setEtablissement(etablissement);
        setDeleteEtablissementDialog(true);
    };

    const deleteEtablissement = () => {
        console.log(etablissement.idEtb)
        EtablissementService.deleteEtablissement(etablissement.idEtb)
            .then(() => {
                const _Etablissements =
                    etablissements.filter((val) =>
                        val.idEtb !== etablissement.idEtb);
                console.log(_Etablissements);
                setEtablissements(_Etablissements);
                setDeleteEtablissementDialog(false);
                setEtablissement(emptyEtablissement);
                loadEtablissements();
                toast.current.show({
                    severity: 'success',
                    summary: 'Succès !',
                    detail: 'Etablissement Supprimé',
                    life: 3000
                });
                console.log("ok")
            })
            .catch((error) => {
                console.error('Error deleting Etablissement:', error);
            });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < etablissements.length; i + 1) {
            if (etablissements[i].idEtb === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteEtablissementsDialog(true);
    };

    const deleteSelectedEtablissements = () => {
        const promises = selectedEtablissements.map((etb) => {
            return EtablissementService.deleteEtablissement(etb.idEtb);
        });
    
        Promise.all(promises)
            .then(() => {
                // After all items are successfully deleted, refresh the data
                return loadEtablissements();
            })
            .then(() => {
                // Clear the selected items and hide the delete dialog
                setSelectedEtablissements(null);
                setDeleteEtablissementsDialog(false);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Etablissements Supprimés', life: 3000 });
            })
            .catch((error) => {
                console.error('Error deleting selected items', error);
                // Handle error if necessary
            });
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _etablissement = { ...etablissement };

        _etablissement[`${name}`] = val;

        setEtablissement(_etablissement);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        const _etablissement = { ...etablissement };

        _etablissement[`${name}`] = val;

        setEtablissement(_etablissement);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Ajouter" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button
                    label="Supprimer"
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedEtablissements || !selectedEtablissements.length}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button icon="pi pi-download" severity="secondary" onClick={exportCSV} />
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editEtablissement(rowData)} />
                <Button
                    icon="pi pi-trash"
                    rounded
                    severity="danger"
                    onClick={() => confirmDeleteEtablissement(rowData)}
                />
            </>
        );
    };

    const NombreMateriel = (rowData) => {
        const [materielCount, setMaterielCount] = useState(0);
      
        useEffect(() => {
          const fetchMaterielsCount = async () => {
            try {
              const count = await EtablissementService.nbMatByEtablissement(rowData.idEtb); // Replace with your actual backend API call
              setMaterielCount(count);
            } catch (error) {
              console.error('Error fetching materiels count:', error);
              setMaterielCount(0);
            }
          };
      
          fetchMaterielsCount();
        }, [rowData.idEtb]);
      
        return materielCount;
      };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Etablissements</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const etablissementDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveEtablissement} />
        </>
    );
    const deleteEtablissementDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteEtablissementDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteEtablissement} />
        </>
    );
    const deleteEtablissementsDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteEtablissementsDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedEtablissements} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable
                    ref={dt}
                    value={etablissements}
                    selection={selectedEtablissements}
                    onSelectionChange={(e) => setSelectedEtablissements(e.value)}

                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} etablissements"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column selectionMode="multiple" exportable={false} />
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }} />
                    <Column field="adresse" header="Adresse" sortable style={{ minWidth: '16rem' }} />
                    <Column field="city" header="Ville" sortable style={{ minWidth: '8rem' }} />
                    <Column header="Nbr Materiel" body={NombreMateriel} sortable style={{ minWidth: '10rem' }} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>

            <Dialog
                visible={etablissementDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Etablissement Details"
                modal
                className="p-fluid"
                footer={etablissementDialogFooter}
                onHide={hideDialog}
            > 

                <div className="field">
                    <span htmlFor="name" className="font-bold">
                        Name
                    </span>
                    <InputText
                        id="name"
                        value={etablissement.name}
                        onChange={(e) => onInputChange(e, 'name')}
                        placeholder='name'
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !etablissement.name })}
                    />
                    {submitted && !etablissement.name && <small className="p-error">Required.</small>}
                </div>

                <div className="field">
                    <span htmlFor="adresse" className="font-bold">
                        Adresse
                    </span>
                    <InputText
                        id="adresse"
                        value={etablissement.adresse}
                        onChange={(e) => onInputChange(e, 'adresse')}
                        placeholder='Adresse'
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !etablissement.adresse })}
                    />
                    {submitted && !etablissement.adresse && <small className="p-error">Required.</small>}
                </div>

                <div className="field">
                    <span htmlFor="city" className="font-bold">
                        Ville
                    </span>
                    <InputText
                        id="city"
                        value={etablissement.city}
                        onChange={(e) => onInputChange(e, 'city')}
                        placeholder='Ville'
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !etablissement.city })}
                    />
                    {submitted && !etablissement.city && <small className="p-error">Required.</small>}
                </div>
            </Dialog>

            <Dialog
                visible={deleteEtablissementDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteEtablissementDialogFooter}
                onHide={hideDeleteEtablissementDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {etablissement && (
                        <span>
                            Are you sure you want to delete <b>{etablissement.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={deleteEtablissementsDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Confirm"
                modal
                footer={deleteEtablissementsDialogFooter}
                onHide={hideDeleteEtablissementsDialog}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {etablissement && <span>Are you sure you want to delete the selected etablissements?</span>}
                </div>
            </Dialog>
        </div>
    );
}

