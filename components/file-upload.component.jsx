import React, {useRef, useState} from 'react';
import {
    FileUploadContainer,
    FormField,
    DragDropText,
    UploadFileBtn,
    FilePreviewContainer,
    ImagePreview,
    PreviewContainer,
    PreviewList,
    FileMetaData,
    RemoveFileIcon,
    InputLabel
} from "./file-upload";

const DEFAULT_MAX_FILES_SIZE_IN_BYTES = 500000;
const KILO_BYTES_PER_BYTE = 100;

const convertNestedObjectToArray = (nestedObj) =>
    Object.keys(nestedObj).map((key) => nestedObj[key])


const convertBytesToKB = bytes => Math.round(bytes / KILO_BYTES_PER_BYTE)

const FileUpload =({
        label,
        updateFilesCb,
        maxFileSizeInBytes = DEFAULT_MAX_FILES_SIZE_IN_BYTES,
        ...otherProps
    })=> {
    const fileInputRef = useRef();
    const [files, setFiles] = useState({})

    const handleUploadBtnClick = () =>{
        fileInputRef.current.click();
    }

    const handleNewFileUpload = (e) => {
        const { files: newFiles } = e.target;
        if (newFiles.length){
            let updatedFiles = addNewFiles(newFiles);
            setFiles(updatedFiles)
            callUpdateFileCb(updatedFiles)
        }
    }

    const addNewFiles = newfiles => {
        for (let file of newfiles){
            if(file.size <= maxFileSizeInBytes){
                if(!otherProps.multiple){
                    return file
                }
                files[file.name] = file;
            }
        }
        return { ...files }
    }

    const callUpdateFileCb = files => {
        const filesAsArray = convertNestedObjectToArray(files)
        updateFilesCb(filesAsArray)
    }

    const removeFile = fileName => {
        delete files[fileName]
        setFiles({ ...files })
        callUpdateFileCb({ ...files })
    }

    return (
        <>
            <FileUploadContainer>
                <InputLabel>{label}</InputLabel>
                <DragDropText>Drag and drop your files anywhere or</DragDropText>
                <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
                    <i className="fas fa-file-upload" />
                    <span> Upload {otherProps.multiple ? "files" : "a file" }</span>
                </UploadFileBtn>
                <FormField
                    ref={fileInputRef}
                    type="file"
                    onChange={handleNewFileUpload}
                    title=""
                    value=""
                    {...otherProps}
                />
            </FileUploadContainer>

            <FilePreviewContainer>
                <span>To Upload</span>
                <PreviewList>
                    {Object.keys(files).map((fileName, index) =>{
                        let file = files[fileName];
                        let isImageFile = file.type.split("/")[0] === "image";
                        return(
                            <PreviewContainer key={fileName}>
                                <div>
                                    {isImageFile && (
                                        <ImagePreview
                                            src={URL.createObjectURL(file)}
                                            alt={`file preview ${index}`}
                                        />
                                    )}
                                    <FileMetaData isImageFile={isImageFile}>
                                        <span>{file.name}</span>
                                        <aside>
                                            <span>{convertBytesToKB(file.size)} kb</span>
                                            <i className="fas fa-trash-alt" />
                                            <RemoveFileIcon
                                                className="fas fa-trash-alt"
                                                onClick={() => removeFile(fileName )}
                                            />
                                        </aside>
                                    </FileMetaData>
                                </div>
                            </PreviewContainer>
                        )
                    })}
                </PreviewList>
            </FilePreviewContainer>
        </>
    );
}

export default FileUpload;