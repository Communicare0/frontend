import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import s from "@styles/modules/board/WritePostPage.module.css";

export default function WritePostPage() {
    //파일 형식, 사이즈, 개수 제한
    const ALLOWED_IMAGE_TYPES = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
    ]; // 이미지 파일만 허용
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 최대 5MB
    const MAX_COUNT = 5; // 최대 5개

    const navigate = useNavigate();
    const { category } = useParams();

    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const isDirty = title.trim() !== "" || content.trim() !== "";

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if(!isDirty) return;
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    const handleAttachClick = () => {
        if(fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const fileList = Array.from(e.target.files);
        const validFiles = [];
        const rejectedFiles = [];
        const bigFiles = [];

        if(files.length + fileList.length > MAX_COUNT) {
            alert(`파일은 최대 5개까지 첨부할 수 있습니다.`);
            return;
        }

        else {
            fileList.forEach((file) => {
                if(!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                    rejectedFiles.push(file.name);
                    return;
                }
                if(file.size > MAX_FILE_SIZE) {
                    bigFiles.push(file.name);
                    return;
                }

                validFiles.push(file);
            })

            if(rejectedFiles.length > 0) {
                alert(
                    `이미지 파일만 업로드할 수 있습니다.\n` +
                    `허용 형식: PNG, JPG, JPEG, GIF, WEBP\n\n` +
                    `제외된 파일: ${rejectedFiles.join(", ")}`
                );
            }

            if(bigFiles.length > 0) {
                alert(
                    `파일의 크기는 최대 5MB입니다.\n` +
                    `제외된 파일: ${bigFiles.join(", ")}`
                );
            }

            setFiles(validFiles);
            console.log("선택된 유효한 파일들:", validFiles);
        }        
    };

    const handleRemoveFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    }

    const handleSubmit = /* async */ (e) => {
        e.preventDefault();

        if(!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const ok = window.confirm("이 내용으로 게시글을 등록하시겠습니까?");
        if(!ok) return;

        try {
            // 여기에 제출 로직
            /*
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);

            files.forEach((file) => {
                formData.append("attachments", file);
            });

            const res = await fetch(`/api/boards/${category}`, {
                method: "POST",
                body: formData,
            });
            
            if(!res.ok) {
                alert("업로드 실패");
                return;
            }
            */
            navigate(`/board/${category}`);
        } catch (err) {
            console.error(err);
            alert("게시글 등록에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        if(isDirty) {
            const ok = window.confirm("작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?");
            if(!ok) return;
        }
        navigate(`/board/${category}`);
    };

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    }

    return (
        <div className={s.page}>
            <div className={s.card}>
                <form className={s.form} onSubmit={handleSubmit}>
                    <div className={s.body}>
                        <input
                            className={s.titleInput}
                            type="text"
                            placeholder="글 제목"
                            value={title}
                            onChange={handleChangeTitle}
                        />
                        <textarea
                            className={s.contentInput}
                            placeholder="내용"
                            value={content}
                            onChange={handleChangeContent}
                        />
                    </div>

                    {/*테스트용: 선택한 파일 이름 보여주기*/}
                    {files.length > 0 && (
                        <div className={s.filePreview}>
                            <span>첨부된 파일:</span>
                            <ul>
                                {files.map((file) => (
                                    <li key={file.name}>
                                        {file.name}
                                        <button
                                            type="button"
                                            className={s.delFileBtn}
                                            onClick={() => handleRemoveFile(file.name)}
                                        >
                                            삭제
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={s.divider} />

                    <div className={s.footer}>
                        <button
                            type="button"
                            className={s.attachBtn}
                            onClick={handleAttachClick}
                        >
                            <img src="/image/paperclip.svg" alt="attach" style={{ width: 32, height: 32 }} />
                        </button>

                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".png, .jpg, .jpeg, .gif, .webp"
                            style={{ display: "none" }}
                        />
                        
                        <div className={s.footerRight}>
                            <button
                                type="button"
                                className={s.cancelBtn}
                                onClick={handleCancel}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className={s.submitBtn}
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}