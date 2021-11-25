import { useState } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

type Props = {
    files: any,
    disabled?: boolean,
    accept: string,
    multiple: boolean,
    maxFile: number,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void

}
export const PDUpload: React.FC<Props> = ({files, disabled = false, accept, multiple, maxFile, onChange, ...props}) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [staticFiles, setStaticFiles] = useState(() => {        
        return files.map((file : any) => {
            file.url = `${process.env.FILE_URL}/${file.img_url}`;                        
            file.uid = file.id || Math.random();
            return file;
        })
    })

    function handleBeforeUpload(file: any) {

        const isLt2M = file.size / 1024 / 1024 < 2;        
        if (!isLt2M) {
             message.error('File size must < 2MB');
            return Upload.LIST_IGNORE;
        }
        return true;
    }

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1))
    };

    const handleChange = ({ fileList } : {fileList: any}) => {
        setStaticFiles(fileList)
        if(onChange) {
            multiple === true ? onChange(fileList): onChange(fileList[0]);
        }
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <>
            <Upload
                //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                //uploading={false}
                beforeUpload={handleBeforeUpload}
                accept={accept}
                listType="picture-card"
                fileList={staticFiles}
                onPreview={(file) => handlePreview(file)}
                onChange={handleChange}
                disabled={disabled}
                multiple={multiple}                
                {...props}
            >
                {staticFiles.length >= maxFile ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img
                    alt={previewTitle}
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
}
