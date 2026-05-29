// 신고 사유 버튼/ 선택지 보여주기
// 신고하기/취소 버튼 보여주기
// 선택한 사유를 부모에게 넘기기
import "./ReportModal.css";

const POST_REPORT_REASONS = [
        "스팸 홍보/도배",
        "욕설/혐오/차별적 표현",
        "거짓/허위 정보",
        "기타 부적절한 내용"
    ];

const COMMENT_REPORT_REASONS = [
        "스팸 홍보/도배",
        "욕설/혐오/차별적 표현",
        "거짓/허위 정보",
        "기타 부적절한 내용"
    ];

function ReportModal({open, type, onSubmit, onClose}){
    if(!open) return null;

    const reasons = 
    type === "comment" ? COMMENT_REPORT_REASONS : POST_REPORT_REASONS;

    return(
<div className="report-modal-backdrop"
onClick={onClose}>

        <div
        className="report-modal"
        onClick={(event)=>event.stopPropagation()}>
            <h3>신고 사유 선택</h3>
            <p>신고 사유를 선택해주세요</p>
        <div className="report-reason-list">
            {reasons.map((reason)=>(
                <button
            type="button"
            key={reason}
            onClick={()=>onSubmit(reason)}
            className="report-reason-button"
            >
                {reason}
            </button>
            ))}
        </div>
            
            
            <button 
            type="button" 
            className="report-cancel-button"
            onClick={onClose}>
            취소
            </button>
        </div>
</div>    
)
}

export default ReportModal;