import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { LivraisonService } from '../services/LivraisonService';

export default function LivraisonsDemo() {
    const emptyLivraison = {
        id: null,
        numBL: null,
        numBC: null,
        model: '',
        date: null,
        quantity: 0,
    };

    const [livraisons, setLivraisons] = useState(null);
    const [livraisonDialog, setLivraisonDialog] = useState(false);
    const [deleteLivraisonDialog, setDeleteLivraisonDialog] = useState(false);
    const [deleteLivraisonsDialog, setDeleteLivraisonsDialog] = useState(false);
    const [livraison, setLivraison] = useState(emptyLivraison);
    const [expandedRows, setExpandedRows] = useState(null);
    const [selectedLivraisons, setSelectedLivraisons] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const _livraison = LivraisonsDemo;

    useEffect(() => {
        LivraisonService.getLivraisons().then((data) => setLivraisons(data));
    }, []);

    const addLivraison = () => {
        if (!livraison.model || !livraison.date || livraison.quantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Erreur !', detail: 'Veuillez remplir tous les champs requis.', life: 3000 });
            return;
        }

        const newId = createId();

        const newLivraison = {
            id: newId,
            numBL: livraison.numBL,
            numBC: livraison.numBC,
            model: livraison.model,
            date: livraison.date,
            quantity: livraison.quantity,
            // Ajoutez d'autres propriétés de livraison ici
        };

        const updatedLivraisons = [...livraisons, newLivraison];
        setLivraisons(updatedLivraisons);

        setLivraison(emptyLivraison);

        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison ajoutée avec succès.', life: 3000 });
    };

    const openNew = () => {
        setLivraison(emptyLivraison);
        setSubmitted(false);
        setLivraisonDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setLivraisonDialog(false);
    };

    const hideDeleteLivraisonDialog = () => {
        setDeleteLivraisonDialog(false);
    };

    const hideDeleteLivraisonsDialog = () => {
        setDeleteLivraisonsDialog(false);
    };

    const saveLivraison = () => {
        setSubmitted(true);
    
        if (livraison.date && livraison.date instanceof Date) {
            // Formatage de la date en "jour/mois/année" avec la localisation française
            const formattedDate = format(livraison.date, 'dd/MM/yyyy', { locale: fr });
    
            const _livraisons = [...livraisons];
            const _livraison = { ...livraison, date: formattedDate };
    
            if (livraison.id) {
                const index = findIndexById(livraison.id);
    
                _livraisons[index] = _livraison;
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Modifié', life: 3000 });
            } else {
                _livraison.id = createId();
                _livraison.image = 'product-placeholder.svg';
                _livraisons.push(_livraison);
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Créé', life: 3000 });
            }
    
            setLivraisons(_livraisons);
            setLivraisonDialog(false);
            setLivraison(emptyLivraison);
        }
    };
    
    

    const editLivraison = (livraison) => {
        setLivraison({ ...livraison });
        setLivraisonDialog(true);
    };

    const confirmDeleteLivraison = (livraison) => {
        setLivraison(livraison);
        setDeleteLivraisonDialog(true);
    };

    const deleteLivraison = () => {
        const _livraisons = livraisons.filter((val) => val.id !== livraison.id);

        setLivraisons(_livraisons);
        setDeleteLivraisonDialog(false);
        setLivraison(emptyLivraison);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraison Supprimée', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < livraisons.length; i+=1) {
            if (livraisons[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i+=1) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteLivraisonsDialog(true);
    };

    const deleteSelectedLivraisons = () => {
        const _livraisons = livraisons.filter((val) => !selectedLivraisons.includes(val));

        setLivraisons(_livraisons);
        setDeleteLivraisonsDialog(false);
        setSelectedLivraisons(null);
        toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Livraisons Supprimées', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        const _livraison = { ...livraison };

        _livraison[`${name}`] = val;

        setLivraison(_livraison);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        const _livraison = { ...livraison };

        _livraison[`${name}`] = val;

        setLivraison(_livraison);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Ajouter" icon="pi pi-plus" raised severity="success" onClick={openNew} />
                <Button label="Supprimer" icon="pi pi-trash" raised severity="danger" onClick={confirmDeleteSelected} disabled={!selectedLivraisons || !selectedLivraisons.length} />
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
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editLivraison(rowData)} />
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteLivraison(rowData)} />
            </fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {
        let tag;
          if(rowData.status === "CREATED") {
            tag = <Tag value="CRÉÉ" severity={getSeverity(rowData)} />;
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
                        <h4>Livraisons du :  {data.numBC}</h4>
                    </div>
                </div>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Liste des Livraisons</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
            </span>
        </div>
    );

    const livraisonDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" onClick={saveLivraison} />
        </fragment>
    );

    const deleteLivraisonDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteLivraisonDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteLivraison} />
        </fragment>
    );

    const deleteLivraisonsDialogFooter = (
        <fragment>
            <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteLivraisonsDialog} />
            <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedLivraisons} />
        </fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable value={livraisons} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate} selection={selectedLivraisons} onSelectionChange={(e) => setSelectedLivraisons(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} livraisons" globalFilter={globalFilter}  header={header} tableStyle={{ minWidth: '60rem' }}>
                <Column selectionMode="multiple" exportable={false} />
                {/* <Column expander={allowExpansion} style={{ width: '5rem' }} /> */}
                <Column field="numBl" header="N° BL" />
                <Column field="numBc" header="N° BC" />
                <Column field="date" header="Date" sortable/>
                <Column field="quantity" header="Quantité" sortable />
                <Column field="" header="Bon Livraison" body={bonLivAction} />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>
            </div>
            <Dialog visible={livraisonDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Matériel Détails" modal className="p-fluid" footer={livraisonDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <span htmlFor="date" className="font-bold">
                        Date
                    </span>
                    <Calendar value={livraison.date} onChange={(e) => onInputChange(e, 'date')}  required autoFocus className={classNames({ 'p-invalid': submitted && !livraison.date })}/>
                    {submitted && !livraison.date && <small className="p-error">Date is required.</small>}
                </div>  
                <div className="field">
                    <span htmlFor="prestataire" className="font-bold">
                        Prestataire
                    </span>
                    <Dropdown value={livraison.prestataire} onChange={(e) => onInputChange(e, 'prestataire')} options={prestataires} optionLabel="name" placeholder="Select a Prestataire" 
                            filter valueTemplate={selectedPrestataireTemplate} itemTemplate={prestataireOptionTemplate} required autoFocus className={classNames({ 'p-invalid': submitted && !livraison.prestataire })} />
                    {submitted && !_livraison.prestataire && <small className="p-error">Prestataire is required.</small>}
                </div>
                <div className="field">
                    <span htmlFor="materiel" className="font-bold">
                        Matériel
                    </span>
                    <InputText placeholder='materiel' id="materiel" value={livraison.materiel} onChange={(e) => onInputChange(e, 'materiel')} required autoFocus className={classNames({ 'p-invalid': submitted && !livraison.materiel })} />
                    {submitted && !livraison.materiel && <small className="p-error">Matériel is required.</small>}
                </div>  
                <div className="field">
                    <span htmlFor="quantity" className="font-bold">
                        Quantité
                    </span>
                    <InputNumber placeholder='quantity' id="quantity" value={livraison.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} mode="decimal" required autoFocus className={classNames({ 'p-invalid': submitted && livraison.quantity <= 0 })} />
                    {submitted && livraison.quantity <= 0 && <small className="p-error">Quantité must be greater than 0.</small>}
                </div>
                <div className="field col">
                        <span htmlFor="bl" className="font-bold">
                            BonLiv
                        </span>
                        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" />
                    </div>
            </Dialog>

            <Dialog visible={deleteLivraisonDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteLivraisonDialogFooter} onHide={hideDeleteLivraisonDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {livraison && <span>Êtes-vous sûr de vouloir supprimer la livraison <b>{livraison.numBL}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteLivraisonsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteLivraisonsDialogFooter} onHide={hideDeleteLivraisonsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {selectedLivraisons && <span>Êtes-vous sûr de vouloir supprimer les livraisons sélectionnées?</span>}
                </div>
            </Dialog>
        </div>
    );
}

