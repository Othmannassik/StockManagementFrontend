import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
        

export default function Materiels() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  

  return (
  
    <div className="card">
            <DataTable value={posts} tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="Id" sortable style={{ width: '25%' }} />
                <Column field="title" header="NaTitleme" sortable style={{ width: '25%' }} />
                <Column field="body" header="Category" sortable style={{ width: '25%' }} />
            </DataTable>
        </div>
    
  );
}
