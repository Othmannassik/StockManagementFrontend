import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
// import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
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
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    TypeMaterielService.getTypeMateriels().then((data) => setTypeMateriels(data));
  }, []);

  const openNew = () => {
    setTypeMateriel(emptyTypeMateriel);
    setSubmitted(false);
    setTypeMaterielDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTypeMaterielDialog(false);
  };

  const hideDeleteTypeMaterielDialog = () => {
    setDeleteTypeMaterielDialog(false);
  };

  const hideDeleteTypeMaterielsDialog = () => {
    setDeleteTypeMaterielsDialog(false);
  };

  // const saveTypeMateriel = () => {
  //   setSubmitted(true);

  //   if (Typemateriel.name.trim()) {
  //     const _Typemateriels = [...Typemateriels];
  //     const _Typemateriel = {
  //       ...Typemateriels
  //     };

  //     if (Typemateriel.idTypeMat) {
  //       const index = findIndexById(Typemateriel.idTypeMat);

  //       _Typemateriels[index] = _Typemateriel;
  //       toast.current.show({
  //         severity: 'success',
  //         summary: 'Succès !',
  //         detail: 'Type Materiel Modifié',
  //         life: 3000
  //       });
  //     } else {
  //       _Typemateriel.id = createId();
  //       _Typemateriels.push(_Typemateriel);
  //       toast.current.show({
  //         severity: 'success',
  //         summary: 'Succès !',
  //         detail: 'Type Materiel Creé',
  //         life: 3000
  //       });
  //     }

  //     setTypeMateriels(_Typemateriels);
  //     setTypeMaterielDialog(false);
  //     setTypeMateriel(emptyTypeMateriel);
  //   }
  // };

  const saveTypeMateriel = () => {
    setSubmitted(true);

    if (Typemateriel.name.trim()) {
        const _Typemateriels = [...Typemateriels];
        const _Typemateriel = { ...Typemateriel };

        if (Typemateriel.idTypeMat) {
            const index = findIndexById(Typemateriel.idTypeMat);

            _Typemateriels[index] = _Typemateriel;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            _Typemateriel.idTypeMat = createId(1,1000)
            _Typemateriels.push(_Typemateriel);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

      setTypeMateriels(_Typemateriels);
      setTypeMaterielDialog(false);
      setTypeMateriel(emptyTypeMateriel);
    }
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
    const _Typemateriels = Typemateriels.filter((val) => val.idTypeMat !== Typemateriel.idTypeMat);

    setTypeMateriels(_Typemateriels);
    setDeleteTypeMaterielDialog(false);
    setTypeMateriel(emptyTypeMateriel);
    toast.current.show({
      severity: 'success',
      summary: 'Succès !',
      detail: 'Type Matériel Supprimé',
      life: 3000
    });
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

  // const createId = () => {
  //   let id = '';
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  //   for (let i = 0; i < 5; i + 1) {
  //     id += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }

  //   return id;
  // };

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
    const _Typemateriels = Typemateriels.filter((val) => !selectedTypeMateriels.includes(val));

    setTypeMateriels(_Typemateriels);
    setDeleteTypeMaterielsDialog(false);
    setSelectedTypeMateriels(null);
    toast.current.show({
      severity: 'success',
      summary: 'Succès !',
      detail: 'Types Matériaux Supprimés',
      life: 3000
    });
  };

  // const onCategoryChange = (e) => {
  //   const _Typemateriel = {
  //     ...Typemateriel
  //   };

  //   _Typemateriel.category = e.value;
  //   setTypeMateriel(_Typemateriel);
  // };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    const _Typemateriel = {
      ...Typemateriel
    };

    _Typemateriel[`${name}`] = val;

    setTypeMateriel(_Typemateriel);
  };

  // const onInputNumberChange = (e, name) => {
  //   const val = e.value || 0;
  //   const _Typemateriel = {
  //     ...Typemateriel
  //   };

  //   _Typemateriel[`${name}`] = val;

  //   setTypeMateriel(_Typemateriel);
  // };

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
        <Button label="EXCEL" icon="pi pi-download" className="p-button-help" onClick={exportCSV} />
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
          <Column key="name" field="name" header="Name" style={{ minWidth: '16rem' }} />
          <Column key="actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }} />
        </DataTable>
      </div>

      <Dialog visible={TypematerielDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Matériel Détails" modal className="p-fluid" footer={TypematerielDialogFooter} onHide={hideDialog}>
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
            className={classNames({ 'p-invalid': submitted && !Typemateriel.name })}
          />
          {submitted && !Typemateriel.name && <small className="p-error">Model is required.</small>}
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



