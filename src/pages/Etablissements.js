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
        ville: '',
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

        if (etablissement.name.trim()) {
            const _etablissements = [...etablissements];
            const _etablissement = { ...etablissement };

            if (etablissement.idEtb) {
                // Update existing etablissement
                console.log(etablissement.idEtb);
                // TypeMaterielService.updateTypeMateriel(Typemateriel.idTypeMat, _Typemateriel)
                EtablissementService.updateEtablissement(etablissement.idEtb , _etablissement)
                    // console.log(_Typemateriel)
                    .then(() => {
                        const index = etablissement.idEtb;
                        _etablissements[index] = _etablissement;
                        setEtablissements(_etablissements);
                        setEtablissementDialog(false);
                        setEtablissement(emptyEtablissement);
                        toast.current.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Updated',
                            life: 3000
                        });
                    })
                    .catch((error) => {
                        console.error('Error updating TypeMateriel:', error);
                    });
            } else {
                // create a Etablissement
                EtablissementService.createEtablissement(_etablissement)
                    .then(() => {
                        const lastidEtb = Math.max(...etablissements.map(item => item.idEtb));
                        _etablissement.idEtb = lastidEtb + 1;
                        _etablissements.push(_etablissement);
                        setEtablissements(_etablissements);
                        setEtablissementDialog(false);
                        setEtablissement(emptyEtablissement);
                        loadEtablissements();
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Etablissement Created', life: 3000 });
                    })
                    .catch((error) => {
                        console.error('Error creating Etablissement:', error);
                    });
            }


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
        const _etablissements = etablissements.filter((val) => !selectedEtablissements.includes(val));

        setEtablissements(_etablissements);
        setDeleteEtablissementsDialog(false);
        setSelectedEtablissements(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Etablissements Deleted', life: 3000 });
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
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button
                    label="Delete"
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
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteEtablissementDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteEtablissement} />
        </>
    );
    const deleteEtablissementsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteEtablissementsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedEtablissements} />
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
                    <Column field="adresse" header="adresse" sortable style={{ minWidth: '16rem' }} />
                    <Column field="ville" header="ville" sortable style={{ minWidth: '8rem' }} />
                    <Column field="nb_Materiel" header="nb_Materiel" sortable style={{ minWidth: '10rem' }} />
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
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !etablissement.city })}
                    />
                    {submitted && !etablissement.city && <small className="p-error">Required.</small>}
                </div>


                <div className="field">
                    <span htmlFor="quantity" className="font-bold">
                        Quantity
                    </span>
                    <InputNumber
                        id="quantity"
                        value={etablissement.nb_Materiel}
                        onValueChange={(e) => onInputNumberChange(e, 'quantity')}
                    />
                    {submitted && !etablissement.nb_Materiel && <small className="p-error">Required.</small>}
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

