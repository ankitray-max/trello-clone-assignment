import React, { useState } from 'react';
import { NewItemFormContainer, NewItemButton, NewItemInput } from './styles';
import { useFocus } from './utils/useFocus';

// Form for inputting a new item. 
// Contains the form itself plus a button to confirm.
export const NewItemForm = ({ onAdd }: NewItemFormProps) => {
  const [text, setText] = useState('');
const [description, setDescription] = useState('');
const [dueDate, setDueDate] = useState('');
  const inputRef = useFocus();

  const handleAddText = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onAdd(text);
    }
  }

  return (
    <NewItemFormContainer>
  <NewItemInput
    ref={inputRef}
    value={text}
    onChange={e => setText(e.target.value)}
    placeholder="Enter task"
  />

  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Description (optional)"
    style={{ marginTop: "8px" }}
  />

  <input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    style={{ marginTop: "8px" }}
  />

  <NewItemButton
    onClick={() => {
      if (!dueDate) {
        alert("Due date is required");
        return;
      }
      console.log("FORM DATA:", text, description, dueDate);

      onAdd(text, description, dueDate);

      setText('');
      setDescription('');
      setDueDate('');
    }}
  >
    Create
  </NewItemButton>
</NewItemFormContainer>
  );
}

type NewItemFormProps = {
  onAdd(text: string, description?: string, dueDate?: string): void;
}