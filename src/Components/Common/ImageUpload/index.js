import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import Photo from "../../../Assets/Images/profile.png";

const ImageUpload = ({ setImageData, imageData, setImageObj }) => {
  const [fileList, setFileList] = useState([]);
  const [fileDefault, setDefaultFile] = useState(null);

  useEffect(() => {
    const createFileFromBlob = async () => {
      try {
        const response = await fetch(Photo);
        const blob = await response.blob();
        const file = new File([blob], "profile.png", { type: "image/png" });

        setDefaultFile(file);
        if (imageData) {
          setFileList([{ uid: "-1", url: imageData, status: "done" }]);
          setImageObj(null);
        } else {
          setFileList([
            { uid: "-1", url: URL.createObjectURL(file), status: "done" },
          ]);
          setImageObj(file);
        }
      } catch (error) {
        console.error("Error creating file from blob:", error);
      }
    };
    createFileFromBlob();
  }, [imageData]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList?.slice(0, 1));
    const file = newFileList?.[0];
    if (file?.originFileObj) {
      setImageObj(file.originFileObj);
    } else {
      setImageObj(fileDefault);
    }
  };

  const beforeUpload = (file) => {
    return false;
  };

  return (
    <ImgCrop rotationSlider>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        beforeUpload={beforeUpload}
      >
        {fileList.length < 1 && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </ImgCrop>
  );
};

export default ImageUpload;
