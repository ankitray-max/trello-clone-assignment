import { useState } from 'react';
import { AddItemButton } from './styles';
import { NewItemForm } from './NewItemForm';

// Represents an option to add a new item in a list.
// By default, contains a button.
// Pressing the button shows a form to input a new item, plus a button to confirm.
export const AddNewItem = (props: AddNewItemProps) => {
  const [showForm, setShowForm] = useState(false);
  const { onAdd, toggleButtonText, dark } = props;
  

  if (showForm) {
    return (
     <NewItemForm onAdd={(text, description, dueDate) => {
  onAdd(text, description, dueDate);
  setShowForm(false);
}} />
    );
  }

  return (
    <AddItemButton dark={dark} onClick={() => setShowForm(true)}>
      {toggleButtonText}
    </AddItemButton>
  );
}

type AddNewItemProps = {
  onAdd(text: string, description?: string, dueDate?: string): void;
  toggleButtonText: string;
  dark?: boolean;
}