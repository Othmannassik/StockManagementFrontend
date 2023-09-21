import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TypeMaterielService } from '../services/TypeMaterielService';

export default function TypeMateriels() {

  const emptyTypeMateriel = {
    idTypeMat: null,
    name: ''
  };

  const [Typemateriels, setTypeMateriels] = useState(null);
  const [TypematerielDialog, setTypeMaterielDialog] = useState(false);
  const [deleteTypeMaterielDialog, setDeleteTypeMaterielDialog] = useState(false);
  const [deleteTypeMaterielsDialog, setDeleteTypeMaterielsDialog] = useState(false);
  const [Typemateriel, setTypeMateriel] = useState(emptyTypeMateriel);
  const [selectedTypeMateriels, setSelectedTypeMateriels] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    loadTypeMateriels();
  }, []);

  const loadTypeMateriels = () =>{
    TypeMaterielService.getTypeMateriels().then((data) => setTypeMateriels(data));
  };

  const openNew = () => {
    setTypeMateriel(emptyTypeMateriel);
    setTypeMaterielDialog(true);
  }; 

  const hideDialog = () => {
    setTypeMaterielDialog(false);
  };

  const hideDeleteTypeMaterielDialog = () => {
    setDeleteTypeMaterielDialog(false);
  };

  const hideDeleteTypeMaterielsDialog = () => {
    setDeleteTypeMaterielsDialog(false);
  };

  const saveTypeMateriel = () => {

    if (Typemateriel.name) {

        if (Typemateriel.idTypeMat) {
            TypeMaterielService.updateTypeMateriel(Typemateriel.idTypeMat, Typemateriel)
            .then((data) => {
              loadTypeMateriels();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Typemateriel Modifié', life: 3000 })
            })                
        } else {
            TypeMaterielService.createTypeMateriel(Typemateriel)
            .then((data) => {
              loadTypeMateriels();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Typemateriel Creé', life: 3000 })
            })
        }
    }
    else {
      toast.current.show({ severity: 'error', summary: 'Echèc !', detail: 'Veuillez Remplir Tous Les Champs', life: 3000 })
      return;
    }
    setTypeMaterielDialog(false);
    setTypeMateriel(emptyTypeMateriel);
};



  const editTypeMateriel = (Typemateriel) => {
    setTypeMateriel({
      ...Typemateriel
    });
    setTypeMaterielDialog(true);
  };

  const confirmDeleteTypeMateriel = (Typemateriel) => {
    setTypeMateriel(Typemateriel);
    setDeleteTypeMaterielDialog(true);
  };
  const deleteTypeMateriel = () => {
    TypeMaterielService.deleteTypeMateriel(Typemateriel.idTypeMat)
            .then(() => {
                loadTypeMateriels();
                toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'TypeMateriel Supprimé', life: 3000 });
            })

        setDeleteTypeMaterielDialog(false);
        setTypeMateriel(emptyTypeMateriel);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < Typemateriels.length; i + 1) {
      if (Typemateriels[i].id === id) {
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
    setDeleteTypeMaterielsDialog(true);
  };



  const deleteSelectedTypeMateriels = () => {
    const promises = selectedTypeMateriels.map((prop) => {
        return TypeMaterielService.deleteTypeMateriel(prop.idTypeMat);
    });

    Promise.all(promises)
        .then(() => {
            // After all items are successfully deleted, refresh the data
            return loadTypeMateriels();
        })
        .then(() => {
            // Clear the selected items and hide the delete dialog
            setSelectedTypeMateriels(null);
            setDeleteTypeMaterielsDialog(false);
            toast.current.show({ severity: 'success', summary: 'Succès !', detail: 'Types Matériel Supprimés', life: 3000 });
        })
        .catch((error) => {
            console.error('Error deleting selected items', error);
            // Handle error if necessary
        });
};


  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    const _Typemateriel = {
      ...Typemateriel
    };

    _Typemateriel[`${name}`] = val;

    setTypeMateriel(_Typemateriel);
  };


  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Ajouter" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Supprimer" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTypeMateriels || !selectedTypeMateriels.length} />
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
        <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => editTypeMateriel(rowData)} />
        <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteTypeMateriel(rowData)} />
      </>
    );
  };

  const NombreMateriel = (rowData) => {
    const [materielCount, setMaterielCount] = useState(0);
  
    useEffect(() => {
      const fetchMaterielsCount = async () => {
        try {
          const count = await TypeMaterielService.nbMatByTypeMateriel(rowData.idTypeMat); // Replace with your actual backend API call
          setMaterielCount(count);
        } catch (error) {
          console.error('Error fetching materiels count:', error);
          setMaterielCount(0);
        }
      };
  
      fetchMaterielsCount();
    }, [rowData.idTypeMat]);
  
    return materielCount;
  };

  

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Liste des Types de Matériel</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Chercher..." />
      </span>
    </div>
  );

  const TypematerielDialogFooter = (
    <>
      <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Enregistrer" icon="pi pi-check" onClick={saveTypeMateriel} />
    </>
  );

  const deleteTypeMaterielDialogFooter = (
    <>
      <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteTypeMaterielDialog} />
      <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteTypeMateriel} />
    </>
  );

  const deleteTypeMaterielsDialogFooter = (
    <>
      <Button label="Annuler" icon="pi pi-times" outlined onClick={hideDeleteTypeMaterielsDialog} />
      <Button label="Oui, Supprimer" icon="pi pi-check" severity="danger" onClick={deleteSelectedTypeMateriels} />
    </>
  );




  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />

        <DataTable ref={dt} value={Typemateriels} selection={selectedTypeMateriels} onSelectionChange={(e) => setSelectedTypeMateriels(e.value)}
          dataKey="idTypeMat" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Typemateriels" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false} />
          <Column key="name" field="name" header="Name" />
          <Column field="" header="Nbr Materiel" body={NombreMateriel} />
          <Column key="actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
        </DataTable>
      </div>

      <Dialog visible={TypematerielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Type Matériel Détails" modal className="p-fluid" footer={TypematerielDialogFooter} onHide={hideDialog}>
        <div className="field">
          <span htmlFor="model" className="font-bold">
            Name
          </span>
          <InputText
            placeholder='Modèle'
            id="model"
            value={Typemateriel.name} // Ensure that the value is controlled by Typemateriel.name
            onChange={(e) => onInputChange(e, 'name')}
            required
            autoFocus
          />
        </div>
      </Dialog>

      <Dialog visible={deleteTypeMaterielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteTypeMaterielDialogFooter} onHide={hideDeleteTypeMaterielDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {Typemateriel && (
            <span>
              Vous Voulez Vraiment Supprimer <b>{Typemateriel.name}</b> ?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteTypeMaterielsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteTypeMaterielsDialogFooter} onHide={hideDeleteTypeMaterielsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {Typemateriel && <span>Vous Voulez Vraiment Effectuer La Suppression ?</span>}
        </div>
      </Dialog>
    </div>
  );
}




