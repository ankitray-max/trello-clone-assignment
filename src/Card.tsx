import { CardContainer } from './styles';
import { isHidden } from './utils/isHidden';
import { moveTask } from './state/actions';
import { useAppState } from './state/AppStateContext';
import { useDrop } from 'react-dnd';
import { useItemDrag } from './utils/useItemDrag';
import { useRef, useState, useEffect } from 'react';

// 🎨 ADD THIS (labels list)
const allLabels = [
  { id: 1, name: "Urgent", color: "red" },
  { id: 2, name: "Feature", color: "green" },
  { id: 3, name: "Bug", color: "blue" }
];

export const Card = ({ text, description, dueDate, id, labels, members, columnId, completed, isPreview }: CardProps) => {

  // ✅ FIX HERE
  const { draggedItem, dispatch } = useAppState();

  const ref = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(description || "");
  const [titleEdit, setTitleEdit] = useState(text);

  const allMembers = [
    { id: 1, name: "Rishu" },
    { id: 2, name: "Ankit" }
  ];

  useEffect(() => {
    setDesc(description || "");
  }, [description]);

  const { drag } = useItemDrag({ type: 'CARD', id, text, columnId });

  const [, drop] = useDrop({
    accept: 'CARD',
    drop() {
      if (!draggedItem) return;
      if (draggedItem.type !== 'CARD') return;
      if (draggedItem.id === id) return;

      dispatch(moveTask(draggedItem.id, id, draggedItem.columnId, columnId));
    }
  });

  drag(drop(ref));

  return (
    <CardContainer
      isHidden={isHidden(draggedItem, 'CARD', id, isPreview)}
      isPreview={isPreview}
      ref={ref}
      onClick={() => setIsEditing(true)}
    >
      <div>

        {/* ⭕ + Title */}
        <div style={{ display: "flex", alignItems: "center" }}>
          
          <div
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                type: "TOGGLE_TASK",
                payload: { id }
              });
            }}
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              border: "2px solid black",
              marginRight: "8px",
              backgroundColor: completed ? "green" : "white",
              cursor: "pointer"
            }}
          />

          {isEditing ? (
            <input
              value={titleEdit}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setTitleEdit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  dispatch({
                    type: "UPDATE_TASK_TITLE",
                    payload: { id, title: titleEdit }
                  });
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <div
              style={{
                textDecoration: completed ? "line-through" : "none"
              }}
            >
              {text}
            </div>
          )}
        </div>

        {/* 📄 Description */}
        {description && (
          <div style={{ fontSize: "12px", color: "gray" }}>
            {description}
          </div>
        )}

        {/* 📅 Due Date */}
        {dueDate && (
          <div style={{ fontSize: "11px", color: "blue" }}>
            📅 {new Date(dueDate).toLocaleDateString()}
          </div>
        )}

        {/* 🎨 Labels */}
        {labels && labels.map(label => (
          <span
            key={label.id}
            style={{
              backgroundColor: label.color,
              color: "white",
              padding: "2px 6px",
              marginRight: "4px",
              borderRadius: "4px",
              fontSize: "10px",
              display: "inline-block"
            }}
          >
            {label.name}
          </span>
        ))}

        {/* 👥 MEMBERS */}
        {members && members.map(m => (
          <span
            key={m.id}
            style={{
              background: "#333",
              color: "white",
              padding: "2px 6px",
              marginRight: "4px",
              borderRadius: "4px",
              fontSize: "10px",
              display: "inline-block"
            }}
          >
            {m.name}
          </span>
        ))}
      </div>

      {/* ✏️ Edit mode */}
      {isEditing && (
        <div style={{ marginTop: "8px" }}>
          <textarea
            value={desc}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setDesc(e.target.value)}
          />

          {/* 👥 ASSIGN MEMBERS */}
          <div style={{ marginTop: "6px" }}>
            {allMembers.map(m => (
              <button
                key={m.id}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({
                    type: "TOGGLE_MEMBER",
                    payload: { taskId: id, member: m }
                  });
                }}
                style={{ marginRight: "5px" }}
              >
                {m.name}
              </button>
            ))}
          </div>

          {/* 🎨 ASSIGN LABELS */}
          <div style={{ marginTop: "6px" }}>
            {allLabels.map(label => (
              <button
                key={label.id}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({
                    type: "TOGGLE_LABEL",
                    payload: { taskId: id, label }
                  });
                }}
                style={{ marginRight: "5px" }}
              >
                {label.name}
              </button>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();

              dispatch({
                type: "UPDATE_TASK_DESCRIPTION",
                payload: { id, description: desc }
              });

              dispatch({
                type: "UPDATE_TASK_TITLE",
                payload: { id, title: titleEdit }
              });

              setIsEditing(false);
            }}
          >
            Save
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();

              if (!window.confirm("Are you sure you want to delete this card?")) return;

              dispatch({
                type: "DELETE_TASK",
                payload: { id, listId: columnId }
              });
            }}
            style={{ marginLeft: "8px", color: "red" }}
          >
            Delete
          </button>
        </div>
      )}
    </CardContainer>
  );
};

type CardProps = {
  id: string;
  text: string;
  description?: string;
  dueDate?: string;
  columnId: string;
  labels?: { id: number; name: string; color: string }[];
  members?: { id: number; name: string }[];
  completed?: boolean;
  isPreview?: boolean;
};