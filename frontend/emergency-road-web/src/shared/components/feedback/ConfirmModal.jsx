import "./ConfirmModal.css";

function ConfirmModal({open, title, message, confirmText, onConfirm, onCancel}){
    if(!open) return null;

    return(
    <>
        <div className="confirm-modal-backdrop">
            <div className="confirm-modal">
                <h2>{title}</h2>
                <p>{message}</p>

                <div className="confirm-modal-actions">
                <button type="button" onClick={onCancel}>
                    취소
                </button>
                <button type="button" className="danger" onClick={onConfirm}>
                    {confirmText}
                </button>
                </div>
            </div>
            </div>
    </>
    );
}

export default ConfirmModal;