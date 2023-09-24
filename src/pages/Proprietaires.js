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
import { Tag } from 'primereact/tag';
import { ProprietaireService } from '../services/ProprietaireService';
import { useAccessToken } from '../services/AccessTokenProvider';


export default function ProprietairesDemo() {
    const emptyProprietaire = {
        idProp: null,
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
    };

    const emptyMateriel = {
        materiel: '',
        date: '',
        numSerie: '',
        inventaireCih: '',
        motif: '',
    };

    const [Proprietaires, setProprietaires] = useState(null);
    const [ProprietaireDialog, setProprietaireDialog] = useState(false);
    const [materielDialog, setMaterielDialog] = useState(false);
    const [deleteProprietaireDialog, setDeleteProprietaireDialog] = useState(false);
    const [deleteMaterielDialog, setDeleteMaterielDialog] = useState(false);
    const [deleteProprietairesDialog, setDeleteProprietairesDialog] = useState(false);
    const [Proprietaire, setProprietaire] = useState(emptyProprietaire);
    const [Materiel, setMateriel] = useState(emptyMateriel);
    const [selectedProprietaires, setSelectedProprietaires] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [materielDialogVisible, setMaterielDialogVisible] = useState(false);
    const [materiels, setMateriels] = useState(null);
    const [materielsChoices, setMaterielsChoices] = useState(null);
    const [modelName, setModelName] = useState("");
    const toast = useRef(null);
    const dt = useRef(null);
    let { accessToken } = useAccessToken();


    const loadProprietaireData = () => {
        ProprietaireService.getProprietaires(accessToken).then((data) => setProprietaires(data));
    }

    useEffect(() => {
        if(!accessToken){
            accessToken = localStorage.getItem('access_token');
          }
        loadProprietaireData();
        ProprietaireService.getMateriels(accessToken)
            .then((data) => setMaterielsChoices(data))
    }, []);

    const openNew = () => {
        setProprietaire(emptyProprietaire);
        setProprietaireDialog(true);
    };

    const openNew2 = () => {
        setMateriel(emptyMateriel);
        setMaterielDialog(true);
    };

    const hideDialog = () => {
        setProprietaireDialog(false);
        setMaterielDialog(false);
    };

    const hideDeleteProprietaireDialog = () => {
        setDeleteProprietaireDialog(false);
        setDeleteMaterielDialog(false);
    };

    const hideDeleteProprietairesDialog = () => {
        setDeleteProprietairesDialog(false);
    };

    const saveProprietaire = () => {

        if (Proprietaire.firstName && Proprietaire.lastName && Proprietaire.email && Proprietaire.telephone) {

            if (Proprietaire.idProp) {
                ProprietaireService.updateProprietaire(Proprietaire.idProp, Proprietaire, accessToken)
                .then((data) => {
                    loadProprietaireData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Proprietaire Modifié', life: 3000 })
                })                
            } else {
                ProprietaireService.addProprietaire(Proprietaire, accessToken)
                .then((data) => {
                    loadProprietaireData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Proprietaire Creé', life: 3000 })
                })
            }

        } else {
            toast.current.show({ severity: 'error', summary: 'Echèc !', detail: 'Veuillez Remplir Tous Les Champs', life: 3000 })
            return;
        }
        setProprietaireDialog(false);
        setProprietaire(emptyProprietaire);
    };

    const addMateriel = () => {

        if (Materiel.motif && Materiel.numSerie && Materiel.inventaireCih && Materiel.materiel ) {

            Materiel.materiel.numSerie = Materiel.numSerie;
            Materiel.materiel.inventaireCih = Materiel.inventaireCih;

            const affectationData = {
                "date": Materiel.date,
                "motif": Materiel.motif,
                "materielDetailDTO": Materiel.materiel,
                "proprietaireDTO": Proprietaire
            }

            ProprietaireService.addMaterielToProprietaire(affectationData, accessToken)
            .then((data) => {
                ProprietaireService.getMaterielsByProprietaire(Proprietaire.idProp, accessToken)
                    .then((data) => setMateriels(data));
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériel Affecté', life: 3000 })
            })

        } else {
            toast.current.show({ severity: 'error', summary: 'Echèc !', detail: 'Veuillez Remplir Tous Les Champs', life: 3000 })
            return;
        }
        setMaterielDialog(false);
        setMateriel(emptyMateriel);
        setProprietaire(emptyProprietaire);
    };

    const editProprietaire = (Proprietaire) => {
        setProprietaire({ ...Proprietaire });
        setProprietaireDialog(true);
    };

    const confirmDeleteProprietaire = (Proprietaire) => {
        setProprietaire(Proprietaire);
        setDeleteProprietaireDialog(true);
    };

    const confirmDeleteMateriel = (Materiel) => {
        setMateriel(Materiel);
        setModelName(Materiel.materielDetailDTO.materielDTO.model);
        setDeleteMaterielDialog(true);
    };

    const deleteProprietaire = () => {
        ProprietaireService.deleteProprietaire(Proprietaire.idProp, accessToken)
            .then(() => {
                loadProprietaireData();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Proprietaire Supprimé', life: 3000 });
            })

        setDeleteProprietaireDialog(false);
        setProprietaire(emptyProprietaire);
    };

    const deleteMateriel = () => {
        ProprietaireService.deleteMateriel(Materiel.idAff, accessToken)
            .then(() => {
                ProprietaireService.getMaterielsByProprietaire(Materiel.proprietaireDTO.idProp, accessToken)
                    .then((data) => setMateriels(data));
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Matériel Retiré', life: 3000 });
            })

        setDeleteMaterielDialog(false);
        setMateriel(emptyMateriel);
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

    const exportExcel = () => {
        ProprietaireService.export(accessToken)
        .then((response) => {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Proprietaires";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('Error exporting data', error);
        });
      };

    const confirmDeleteSelected = () => {
        setDeleteProprietairesDialog(true);
    };

    const deleteSelectedProprietaires = () => {
        const promises = selectedProprietaires.map((prop) => {
            return ProprietaireService.deleteProprietaire(prop.idProp, accessToken);
        });
    
        Promise.all(promises)
            .then(() => {
                // After all items are successfully deleted, refresh the data
                return loadProprietaireData();
            })
            .then(() => {
                // Clear the selected items and hide the delete dialog
                setSelectedProprietaires(null);
                setDeleteProprietairesDialog(false);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Proprietaires Supprimés', life: 3000 });
            })
            .catch((error) => {
                console.error('Error deleting selected items', error);
                // Handle error if necessary
            });
    };
    

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _Proprietaire = { ...Proprietaire };

        _Proprietaire[`${name}`] = val;

        setProprietaire(_Proprietaire);
    };

    const onInputChange2 = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _Materiel = { ...Materiel };

        _Materiel[`${name}`] = val;
        setMateriel(_Materiel);
    };

    const materielButton = (rowData) => {
        return <Button label="Matériels" rounded icon="pi pi-external-link" onClick={() => openMaterielDialog(rowData)} />;
    };

    const openMaterielDialog = (rowData) => {
        ProprietaireService.getMaterielsByProprietaire(rowData.idProp, accessToken)
            .then((data) => {
                setMateriels(data)
                setMaterielDialogVisible(true);
                setProprietaire(rowData);
            });
    };

    const selectedMaterielTemplate = (option, props) => {
        if (option) {
            const tagSeverity = option.usageCount > 0 ? "warning" : "";
            return (
                <div className="flex align-items-center">
                    <Tag severity={tagSeverity} className="mr-2" icon="pi pi-user" value={option.usageCount} />
                    <div>{option.materielDTO.model}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const materielOptionTemplate = (option) => {
        const tagSeverity = option.usageCount > 0 ? "warning" : "";
        return (
            <div className="flex align-items-center">
                <Tag className="mr-2" icon="pi pi-user" severity={tagSeverity} value={`${option.usageCount} Affectation`}  />
                <div>{option.materielDTO.model}</div>
            </div>
        );
    };

//    const materielButton = (selectedProprietaire) => {
//        return <Button label="Matériels" rounded icon="pi pi-external-link" onClick={() => openMaterielDialog(selectedProprietaire)} />;
//    };

//    const openMaterielDialog = (selectedProprietaire) => {
//        setSelectedProprietaire(selectedProprietaire);
//        setMaterielDialogVisible(true);
//    };

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
               <Button icon="pi pi-download" severity="secondary" onClick={exportExcel} />
          </div>
        );
    };

    const leftToolbarTemplate2 = () => {
        return <Button label="Ajouter" icon="pi pi-plus" severity="success" onClick={openNew2} />
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editProprietaire(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteProprietaire(rowData)} />
            </fragment>
        );
    };

    const actionBodyTemplate2 = (rowData) => {
        return (
            <fragment>
                <Button label='Retirer' icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteMateriel(rowData)} />
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
    const MaterielDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={addMateriel} />
        </fragment>
    );
    const deleteProprietaireDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteProprietaireDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteProprietaire} />
        </fragment>
    );
    const deleteMaterielDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteProprietaireDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteMateriel} />
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
                        dataKey="idProp"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
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

            <Dialog header={leftToolbarTemplate2} visible={materielDialogVisible} style={{ width: '60vw' }} maximizable
                    modal contentStyle={{ height: '500px' }} onHide={() => setMaterielDialogVisible(false)} footer={materielDialogFooterTemplate}>
                <DataTable value={materiels} scrollable scrollHeight="flex" tableStyle={{ minWidth: '50rem' }}>
                    <Column field="materielDetailDTO.materielDTO.model" header="Matériel" />
                    <Column field="materielDetailDTO.numSerie" header="N° Série" />
                    <Column field="materielDetailDTO.inventaireCih" header="Inventaire Cih" />
                    <Column field="date" header="Date d'Affectation" />
                    <Column field="motif" header="Motif" />
                    <Column body={actionBodyTemplate2} exportable={false} />
                </DataTable>
            </Dialog>

            <Dialog visible={ProprietaireDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Proprietaire Détails" modal className="p-fluid" footer={ProprietaireDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="firstName" className="font-bold">
                        Prénom
                    </span>
                    <InputText placeholder='Prénom' id="firstName" value={Proprietaire.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus />
                </div>
                <div className="field">
                    <span htmlFor="lastName" className="font-bold">
                        Nom
                    </span>
                    <InputText placeholder='Nom' id="lastName" value={Proprietaire.lastName} onChange={(e) => onInputChange(e, 'lastName')} required autoFocus />
                </div>
                <div className="field">
                    <span htmlFor="email" className="font-bold">
                        Email
                    </span>
                    <InputText type='email' placeholder='email' id="email" value={Proprietaire.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus/>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <span htmlFor="telephone" className="font-bold">
                            Télephone
                        </span>
                        <InputText id="telephone" placeholder='+212 600000000' value={Proprietaire.telephone} onChange={(e) => onInputChange(e, 'telephone')} />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={materielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter un Matériel" modal className="p-fluid" footer={MaterielDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="date" className="font-bold">
                        Date d'affectation
                    </span>
                    <Calendar placeholder="Date d'affectation" value={Materiel.date} onChange={(e) => onInputChange2(e, "date")}  required autoFocus/>
                </div>
                <div className="field">
                    <span htmlFor="materiel" className="font-bold">
                        Materiel
                    </span>
                    <Dropdown value={Materiel.materiel} onChange={(e) => onInputChange2(e, "materiel")} options={materielsChoices} optionLabel="materielDTO.model" placeholder="Select a Materiel" 
                            filter showClear valueTemplate={selectedMaterielTemplate} itemTemplate={materielOptionTemplate} required autoFocus />
                </div>
                <div className="field">
                    <span htmlFor="numSerie" className="font-bold">
                        N° Série
                    </span>
                    <InputText value={Materiel.numSerie} placeholder='N° Série' id="numSerie" onChange={(e) => onInputChange2(e, 'numSerie')} required autoFocus  />
                </div>
                <div className="field">
                    <span htmlFor="inventaireCih" className="font-bold">
                        Inventaire Cih
                    </span>
                    <InputText value={Materiel.inventaireCih} placeholder='Inventaire Cih' id="inventaireCih" onChange={(e) => onInputChange2(e, 'inventaireCih')} required autoFocus  />
                </div>
                <div className="field">
                    <span htmlFor="motif" className="font-bold">
                        Motif
                    </span>
                    <InputText value={Materiel.motif} placeholder='Motif' id="motif" onChange={(e) => onInputChange2(e, 'motif')} required autoFocus  />
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

            <Dialog visible={deleteMaterielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteMaterielDialogFooter} onHide={hideDeleteProprietaireDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Materiel && (
                        <span>
                            Vous Voulez Vraiment Retirer <b>{modelName}</b> du <b>{Proprietaire.lastName} </b>?
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
        