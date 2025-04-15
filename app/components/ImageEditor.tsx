"use client"; // Required for Next.js 13+ if using state or effects
/* eslint-disable */
import editedImageStyles from '../EditedImages.module.scss';
import React, { useState, useRef, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import cn from "classnames";
import {
  Cropper,
  CropperRef,
  CropperPreview,
  CropperPreviewRef
} from "react-advanced-cropper";
import { AdjustablePreviewBackground } from "../components/AdjustablePreviewBackground";
import { Navigation } from "../components/Navigation";
import { Slider } from "../components/Slider";
import { AdjustableCropperBackground } from "../components/AdjustableCropperBackground";
import { Button } from "../components/Button";
import { ResetIcon } from "../icons/ResetIcon";
import "react-advanced-cropper/dist/style.css";
import "../styles.scss";

if (typeof window !== 'undefined') {
    require('context-filter-polyfill');
}

const ImageEditor = () => {
  interface ImageType {
    _id: string;
    imageUrl: string;
    editedAt: string;
  }
  const [images, setImages] = useState<ImageType[]>([]);
  const [open, setOpen] = useState(false); // for mobile drawer
  const { user } = useUser();

    
  useEffect(() => {
    fetch('/api/users', { method: 'POST' });
  }, []);


useEffect(() => {
  if (user?.id) {
    fetch(`/api/user-images?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setImages(data));
  }
}, [user]);



  const cropperRef = useRef<CropperRef>(null);
  const previewRef = useRef<CropperPreviewRef>(null);

  const [src, setSrc] = useState(""); // Empty initially, will be set on upload
  const [mode, setMode] = useState<"crop" | "brightness" | "hue" | "saturation" | "contrast">("crop");

 const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0
  });

  const onChangeValue = (value: number) => {
    if (mode in adjustments) {
      setAdjustments((previousValue) => ({
        ...previousValue,
        [mode]: value
      }));
    }
  };

  const onReset = () => {
    setMode("crop");
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0
    });
  };

  const onUpload = (event: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof event === "string") {
      setSrc(event);
      onReset();
    } else if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSrc(reader.result);
          onReset();
        }
      };
      reader.readAsDataURL(file);
    }
  };

const onDownload = () => {
  if (cropperRef.current) {
    
    cropperRef.current.getCanvas()?.toBlob((blob) => {
      if (blob) {
        // Generate a random file name
        const randomFileName = `image-${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
        
        // Create a link element
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); 
        link.download = randomFileName;
        link.click(); 
        URL.revokeObjectURL(link.href);
      }
    });
  }
};

const onSave = async () => {
  if (!user) return alert("You must be signed in to save images.");

  const canvas = cropperRef.current?.getCanvas();
  if (!canvas) return alert("Nothing to save.");

  const imageUrl = canvas.toDataURL("image/jpeg");

  const res = await fetch("/api/save-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      imageUrl,
    }),
  });

  if (res.ok) {
    const savedImage = await res.json();
    setImages((prev) => [savedImage.data, ...prev]);
    alert("Image saved successfully!");
  } else {
    alert("Failed to save image.");
  }
};

  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const changed = Object.values(adjustments).some((el) => Math.floor(el * 100));

  const cropperEnabled = mode === "crop";

  return (
    <>

    <div className={"image-editor"}>
      <div className="image-editor__cropper">
        {src ? (
          <Cropper
            src={src}
            ref={cropperRef}
            stencilProps={{
              movable: cropperEnabled,
              resizable: cropperEnabled,
              lines: cropperEnabled,
              handlers: cropperEnabled,
              overlayClassName: cn(
                "image-editor__cropper-overlay",
                !cropperEnabled && "image-editor__cropper-overlay--faded"
              )
            }}
            backgroundWrapperProps={{
              scaleImage: cropperEnabled,
              moveImage: cropperEnabled
            }}
            backgroundComponent={AdjustableCropperBackground}
            backgroundProps={adjustments}
            onUpdate={onUpdate}
          />
        ) : (
          <p className="image-editor__placeholder"></p>
        )}

        {mode !== "crop" && src && (
          <Slider
            className="image-editor__slider"
            value={adjustments[mode]}
            onChange={onChangeValue}
          />
        )}

        {src && (
          <CropperPreview
            className={"image-editor__preview"}
            ref={previewRef}
            cropper={cropperRef}
            backgroundComponent={AdjustablePreviewBackground}
            backgroundProps={adjustments}
          />
        )}

        {changed && (
          <Button className="image-editor__reset-button" onClick={onReset}>
            <ResetIcon />
          </Button>
        )}
      </div>

      <Navigation
        mode={mode}
        onChange={(newMode: string) => setMode(newMode as "crop" | "brightness" | "hue" | "saturation" | "contrast")}
        onUpload={onUpload}
        onDownload={onDownload}
      />

      {src && (
  <Button className="image-editor__save-button" onClick={onSave}>
    Save
  </Button>
)}
    </div>
    <div className={editedImageStyles.wrapper}>
  {/* Mobile hamburger */}
  <button className={editedImageStyles.hamburger} onClick={() => setOpen(!open)}>
    ☰
  </button>
  {/* Bottom grid container */}
  <div className={`${editedImageStyles.gridContainer} ${open ? editedImageStyles.open : ''}`}>
    <h2>Edited Images</h2>
    <div className={editedImageStyles.grid}>
      {images && images.length > 0 ? (
        images.map((img) => (
          <div key={img._id} className={editedImageStyles.imageCard}>
            <img 
              src={img.imageUrl} 
              loading="lazy"
            />
            
          </div>
        ))
      ) : (
        <p className={editedImageStyles.noImages}>No edited images yet</p>
      )}
    </div>
  </div>
</div>


    </>
    
  );
};

export default ImageEditor;
