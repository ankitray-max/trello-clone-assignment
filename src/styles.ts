import styled from 'styled-components';

// NB: Semicolons VERY important here.

export const AppContainer = styled.div`
  align-items: flex-start;
 background: linear-gradient(135deg, #7b4397, #dc2430);
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 20px;
  width: 100%;
`

type DragPreviewContainerProps = {
  isHidden?: boolean;
  isPreview?: boolean;
}

export const DragPreviewContainer = styled.div<DragPreviewContainerProps>`
  transform: ${props => (props.isPreview ? 'rotate(5deg)' : undefined)};
  opacity: ${props => (props.isHidden ? 0 : 1)};
`

export const ColumnContainer = styled(DragPreviewContainer)<{ title?: string }>`
  width: 300px;
  min-height: 40px;
  margin-right: 20px;
  border-radius: 14px;
  padding: 12px;
  flex-grow: 0;

  background-color: ${({ title }) => {
    if (title === "To Do") return "#fef3c7";        // 🟡 soft yellow
    if (title === "In Progress") return "#d1fae5";  // 🟢 soft green
    if (title === "Done") return "#e0e7ff";         // 🔵 soft blue
    return "#ebecf0";
  }};

  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export const ColumnTitle = styled.div`
  padding: 8px 12px;
  font-weight: 700;
  font-size: 18px;
`;

export const CardContainer = styled(DragPreviewContainer)`
  background-color: #fff;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 12px 14px;
  max-width: 300px;
  border-radius: 10px;

  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px) scale(1.01);   /* 👈 lift + slight zoom */
    
    box-shadow:
      0 8px 20px rgba(0,0,0,0.15),            /* depth */
      0 0 0 2px rgba(255,255,255,0.6),        /* soft border glow */
      0 0 12px rgba(123, 67, 151, 0.4);       /* purple glow */
  }
`;
type AddItemButtonProps = {
  dark?: boolean
}

export const AddItemButton = styled.button<AddItemButtonProps>`
  background-color: #ffffff3d;
  border-radius: 3px;
  border: none;
  color: ${props => (props.dark ? '#000' : '#fff')};
  cursor: pointer;
  max-width: 300px;
  padding: 10px 12px;
  text-align: left;
  transition: background 85ms ease-in;
  width: 100%;
  &:hover {
    background-color: #ffffff52;
  }
`

export const NewItemFormContainer = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
`

export const NewItemButton = styled.button`
  background-color: #5aac44;
  border-radius: 3px;
  border: none;
  box-shadow: none;
  color: #fff;
  padding: 6px 12px;
  text-align: center;
`

export const NewItemInput = styled.input`
  border-radius: 3px;
  border: none;
  box-shadow: #091e4240 0px 1px 0px 0px;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  width: 100%;
`

// This will be rendered on top of any other element on the page, so z-index: 100.
// No pointer events means it will ignore all mouse events.
export const CustomDragLayerContainer = styled.div`
  height: 100%;
  left: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
`

type DragPreviewWrapperProps = {
  position: {
    x: number;
    y: number;
  }
}

export const DragPreviewWrapper = styled.div.attrs<DragPreviewWrapperProps>(
  ({ position: { x, y } }) => ({ style : { transform: `translate(${x}px, ${y}px)` } })
)<DragPreviewWrapperProps>``