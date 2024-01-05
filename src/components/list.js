import React, { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "../components/list.css";

function List() {
  const [listData, setListData] = useState([]);
  const [selectedList1, setSelectedList1] = useState(false);
  const [selectedList2, setSelectedList2] = useState(false);
  const [creatingNewList, setCreatingNewList] = useState(false);
  const [list3, setList3] = useState([]);
  const [updatedList, setUpdatedList] = useState([]);
  const [showValidation, setShowValidation] = useState(false);

  const paperRef = useRef(null);

  useEffect(() => {
    fetchListData();
  }, []);
  
  const fetchListData = async () => {
    try {
      const response = await fetch('https://apis.ccbp.in/list-creation/lists');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setListData(data.lists || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
  console.log(listData)

  const handleCheckboxChangeList1 = (event) => {
    setSelectedList1(event.target.checked);
  };

  const handleCheckboxChangeList2 = (event) => {
    setSelectedList2(event.target.checked);
  };

  const handleCreateNewList = () => {
    if (!selectedList1 || !selectedList2) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setCreatingNewList(true);
    setList3([]);
  };

  const handleCancel = () => {
    setSelectedList1(false);
    setSelectedList2(false);
    setCreatingNewList(false);
    setList3([]);
    setShowValidation(false);
  };

  const handleUpdate = () => {
    setUpdatedList([
      ...listData.filter((item) => selectedList1 && item.listId === 'LIST1'),
      ...listData.filter((item) => selectedList2 && item.listId === 'LIST2'),
      ...list3.map((item) => ({ ...item, listId: 'LIST3' })),
    ]);
    setCreatingNewList(false);
  };

  const handleMoveToList3 = (item) => {
    setList3([...list3, item]);
  };

  // const handleArrowClick = (item, list) => {
  //   if (list === 'LIST1') {
  //     setSelectedList1(false);
  //     setListData(listData.filter((data) => data.id !== item.id));
  //   } else if (list === 'LIST2') {
  //     setSelectedList2(false);
  //     setListData(listData.filter((data) => data.id !== item.id));
  //   } else if (list === 'LIST3') {
  //     setList3(list3.filter((data) => data.id !== item.id));
  //   }
  //   setUpdatedList([
  //     ...listData.filter((data) => data.listId === 'LIST1'),
  //     ...listData.filter((data) => data.listId === 'LIST2'),
  //     ...list3.map((data) => ({ ...data, listId: 'LIST3' })),
  //   ]);
  //   handleMoveToList3(item);
  // };

  const handleArrowClick = (item, list) => {
    if (list === 'LIST1') {
      setSelectedList1(false);
      setListData(listData.filter((data) => data.id !== item.id));
      handleMoveToList3(item); // Move the item to List 3
    } else if (list === 'LIST2') {
      setSelectedList2(false);
      setListData(listData.filter((data) => data.id !== item.id));
      handleMoveToList3(item); // Move the item to List 3
    } else if (list === 'LIST3') {
      setList3(list3.filter((data) => data.id !== item.id));
  
      // Move the item to List 1 or List 2 based on the arrow clicked
      if (item.list_number === 1) {
        setListData([...listData, { ...item, list_number: 2 }]);
      } else if (item.list_number === 2) {
        setListData([...listData, { ...item, list_number: 1 }]);
      }
    }
  
    // Update updatedList combining List 1, List 2, and List 3 items
    setUpdatedList([
      ...listData.filter((data) => data.list_number === 1),
      ...listData.filter((data) => data.list_number === 2),
      ...list3.map((data) => ({ ...data, list_number: 3 })),
    ]);
  };
  
  
  
  
  

  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [updatedList]);

  return (
    <div className="App">
      <h1>List Creation</h1>
      <Button variant="contained" onClick={handleCreateNewList} style={{ margin: '5px' }}>
        Create New list
      </Button>
      {showValidation && (
        <p style={{ color: 'red' }}>Select both lists to create a new list</p>
      )}
      <Paper
        ref={paperRef}
        style={{
          padding: '10px',
          display: 'flex',
          width: '90%',
          height: '60vh',
          overflowY: 'auto',
          backgroundColor: 'lightblue',
          gap: '20px',
        }}
      >
        {/* List 1 */}
        <div
  style={{
    backgroundColor: 'lightblue',
    flex: '1',
    padding: '10px',
  }}
>
  <h2 style={{ backgroundColor: 'lightblue' }}>
    <input
      type="checkbox"
      checked={selectedList1}
      onChange={handleCheckboxChangeList1}
    />
    List 1
  </h2>
  {listData
    .filter((item) => item.list_number === 1)
    .map((item) => (
      <Card key={item.id} style={{ marginBottom: 10 }}>
        <CardContent>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          {creatingNewList && (
            <ArrowForwardIcon onClick={() => handleArrowClick(item, 'LIST1')} />
          )}
        </CardContent>
      </Card>
    ))}
</div>
        {/* List 3 */}
      
{creatingNewList && (
  <div
    style={{
      backgroundColor: 'lightblue',
      flex: '1',
      padding: '10px',
    }}
  >
    <h2 style={{ backgroundColor: 'lightblue' }}>
      List 3 ({list3.length})
    </h2>
    {list3.map((item) => (
      <Card key={item.id} style={{ marginBottom: 10 }}>
        <CardContent>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          {/* Add arrows for List 3 */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Arrow to move item back to List 1 */}
            <Button onClick={() => handleArrowClick(item, 'LIST3')}>
              <ArrowBackIcon />
            </Button>
            {/* Arrow to move item back to List 2 */}
            <Button onClick={() => handleArrowClick(item, 'LIST3')}>
              <ArrowForwardIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}
        {/* List 2 */}
        <div
  style={{
    backgroundColor: 'lightblue',
    flex: '1',
    padding: '10px',
  }}
>
  <h2 style={{ backgroundColor: 'lightblue' }}>
    <input
      type="checkbox"
      checked={selectedList2}
      onChange={handleCheckboxChangeList2}
    />
    List 2
  </h2>
  {listData
    .filter((item) => item.list_number === 2)
    .map((item) => (
      <Card key={item.id} style={{ marginBottom: 10 }}>
        <CardContent>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          {creatingNewList && (
            <ArrowBackIcon onClick={() => handleArrowClick(item, 'LIST2')} />
          )}
        </CardContent>
      </Card>
    ))}
</div>
        {/* Updated List */}
        {(!creatingNewList && updatedList.length > 0) && (
          <div
            style={{
              backgroundColor: 'lightblue',
              flex: '1',
              padding: '10px',
            }}
          >
            <h2 style={{ backgroundColor: 'lightblue' }}>List 3</h2>
            {updatedList.map((item) => (
              <Card key={item.id} style={{ marginBottom: 10 }}>
                <CardContent>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Paper>
      {creatingNewList && (
        <div>
          <Button variant="contained" onClick={handleCancel} style={{ margin: '5px' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdate} style={{ margin: '5px' }}>
            Update
          </Button>
        </div>
      )}
    </div>
  );
}

export default List;
