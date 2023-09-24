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
import { useAccessToken } from '../services/AccessTokenProvider';


export default function Materiels() { 
    const emptyPrestataire = {
        idPres: null, 
        raisonSocial:'',
        email:'',
        telephone: "",
        nbcmd: 0,
    };

    const [prestataires, setPrestataires] = useState(null);
    const [prestataireDialog, setPrestataireDialog] = useState(false);
    const [deletePrestataireDialog, setDeletePrestataireDialog] = useState(false);
    const [deletePrestatairesDialog, setDeletePrestatairesDialog] = useState(false);
    const [prestataire, setPrestataire] = useState(emptyPrestataire);
    const [selectedPrestataires, setSelectedPrestataires] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    let { accessToken } = useAccessToken();



    const loadPrestataireData = () => {
        PrestataireService.getPrestataires(accessToken).then((data) => setPrestataires(data));
    }

    useEffect(() => {
        if(!accessToken){
            accessToken = localStorage.getItem('access_token');
          }
        loadPrestataireData();
    }, []);


    const openNew = () => {
        setPrestataire(emptyPrestataire);
        setPrestataireDialog(true);
    };

    const hideDialog = () => {
        setPrestataireDialog(false);
    };

    const hideDeletePrestataireDialog = () => {
        setDeletePrestataireDialog(false);
    };

    const hidePrestatairesDialog = () => {
        setDeletePrestatairesDialog(false);
    };

    
    const savePrestataire = () => {

        if (prestataire.raisonSocial && prestataire.email && prestataire.telephone) {

            if (prestataire.idPres) {
                PrestataireService.updatePrestataire(prestataire.idPres, prestataire, accessToken)
                .then((data) => {
                    loadPrestataireData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Prestataire Modifié', life: 3000 })
                })                
            } else {
                PrestataireService.createPrestataire(prestataire, accessToken)
                .then((data) => {
                    loadPrestataireData();
                    toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Prestataire Creé', life: 3000 })
                })
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Echèc !', detail: 'Veuillez Remplir Tous Les Champs', life: 3000 })
            return;
        }
        setPrestataireDialog(false);
        setPrestataire(emptyPrestataire);
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
        PrestataireService.deletePrestataire(prestataire.idPres, accessToken)
            .then(() => {
                loadPrestataireData();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Prestataire Supprimé', life: 3000 });
            })

        setDeletePrestataireDialog(false);
        setPrestataire(emptyPrestataire);
    };

    const findIndexById = (idPres) => {
        let index = -1;

        for (let i = 0; i < prestataires.length; i+1) {
            if (prestataires[i].idPres === idPres) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let idPres = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i+1) {
            idPres += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return idPres;
    };

    const exportExcel = () => {
        PrestataireService.export(accessToken)
        .then((response) => {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Prestataires";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('Error exporting data', error);
        });
      };

    const confirmDeleteSelected = () => {
        setDeletePrestatairesDialog(true);
    };

    const deleteSelectedPrestataires = () => {
        const promises = selectedPrestataires.map((prop) => {
            return PrestataireService.deletePrestataire(prop.idPres, accessToken);
        });
    
        Promise.all(promises)
            .then(() => {
                // After all items are successfully deleted, refresh the data
                return loadPrestataireData();
            })
            .then(() => {
                // Clear the selected items and hide the delete dialog
                setSelectedPrestataires(null);
                setDeletePrestatairesDialog(false);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Prestataires Supprimés', life: 3000 });
            })
            .catch((error) => {
                console.error('Error deleting selected items', error);
                // Handle error if necessary
            });
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
              <Button icon="pi pi-download" severity="secondary" onClick={exportExcel} />
          </div>
        );
    };

const NombreCommande = (rowData) => {
  const [commandCount, setCommandCount] = useState(0);

  useEffect(() => {
    const fetchCommandCount = async () => {
      try {
        const count = await PrestataireService.nbCmdByPrestataire(rowData.idPres, accessToken); // Replace with your actual backend API call
        setCommandCount(count);
      } catch (error) {
        console.error('Error fetching command count:', error);
        setCommandCount(0);
      }
    };

    fetchCommandCount();
  }, [rowData.idPres]);

  return commandCount;
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
                        dataKey="idPres"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} materiels" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false} />
                    <Column field="raisonSocial" header="Raison Social" sortable style={{ minWidth: '12rem' }} />
                    <Column field="email" header="Email" style={{ minWidth: '16rem' }} />
                    <Column field="telephone" header="Téléphone" />
                    <Column header="Nbr Commande" body={NombreCommande} style={{ minWidth: '12rem' }} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
                </DataTable>
            </div>

            <Dialog visible={prestataireDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Prestataire Détails" modal className="p-fluid" footer={prestataireDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="Raison Social" className="font-bold">
                        Raison Social
                    </span>
                    <InputText placeholder='Raison Social' id="Raison Social" value={prestataire.raisonSocial} onChange={(e) => onInputChange(e, 'raisonSocial')} required autoFocus />
                </div>
                <div className="field">
                    <span htmlFor="Email" className="font-bold">
                        Email
                    </span>
                    <InputText placeholder='Email' id="Email" value={prestataire.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus />
                </div>
                <div className="field">
                    <span htmlFor="Téléphone" className="font-bold">
                        Téléphone
                    </span>
                    <InputText placeholder='Téléphone' id="Téléphone" value={prestataire.telephone} onChange={(e) => onInputChange(e, 'telephone')} required autoFocus/>
                </div>
            </Dialog>

            <Dialog visible={deletePrestataireDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletePrestataireDialogFooter} onHide={hideDeletePrestataireDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {prestataire && (
                        <span>
                            Vous Voulez Vraiment Supprimer <b>{prestataire.raisonSocial}</b> ?
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
        