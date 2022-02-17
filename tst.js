import React, { useState } from 'react'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../Firebase/Firebase.init";



export default function ImageUpload() {
    const [progress, setProgress] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);

    const [files, setFiles] = useState([])

    const onSelectFile = (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        const imagesArray = selectedFilesArray.map((file) => {
            setFiles(prevState => [...prevState, file])
            console.log('tt', [URL.createObjectURL(file), file.name]);
            return ([URL.createObjectURL(file), file.name])
        });
        // console.log('array', imagesArray);
        setSelectedImages((previousImages) => [...previousImages, imagesArray]);
        onSelectFileUpload(event)
    };
    console.log('selectedImages', selectedImages);

    const removeImg = (image) => {
        console.log('ig', image);
        setSelectedImages(selectedImages.filter((e) => e !== image))

    }




    const [images, setImages] = useState([])
    const [URLs, setURLs] = useState([])

    const onSelectFileUpload = (imgFiles) => {
        for (let i = 0; i < imgFiles.target.files.length; i++) {
            const files = imgFiles.target.files[i];
            files["id"] = Math.random()
            setImages((prevState) => [...prevState, files])
        }

    };

    console.log(images);

    const uploadFiles = (files) => {
        const promises = []
        files.map((file) => {

            const sotrageRef = ref(storage, `files/${file.name}`);

            const uploadTask = uploadBytesResumable(sotrageRef, file);
            promises.push(uploadTask)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const prog = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(prog);
                },
                (error) => console.log(error),
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
                        setURLs(prevState => [...prevState, downloadURLs])
                        console.log("File available at", downloadURLs);
                    });
                }
            );


        })
        Promise.all(promises)
            .then(() => alert('All images uploaded'))
            .then(err => console.log(err))

    };

    console.log(selectedImages);
    console.log(URLs);
    const handleSubmit = () => { uploadFiles(images); }


    return (

        <div className="shadow sm:rounded-md sm:overflow-hidden bg-white px-4 py-5 bg-white space-y-6 sm:p-6">
            <span>{progress}</span>
            <input
                type="file"
                name="images"
                onChange={(e) => onSelectFile(e)}
                multiple
                accept="image/png , image/jpeg, image/webp"
            />

            <div className=" py-3 text-right ">
                <button type="submit" onClick={() => handleSubmit()} className="inline-flex justify-center py-2 px-4 border border-transparent drop-shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Publish</button>
            </div>

            {selectedImages.length > 0 &&
                (selectedImages.length > 10 ? (
                    <p className="error">
                        You can't upload more than 10 images! <br />
                        <span>
                            please delete <b> {selectedImages.length - 10} </b> of them{" "}
                        </span>
                    </p>
                ) : (
                    ''
                ))}

            <div className="images flex flex-row gap-6">
                {selectedImages &&
                    selectedImages.map((images, index) => {
                        images.map(image => {
                            const splitImgData = image
                            console.log('loop bro', image.split(','))
                            return (

                                <div key={splitImgData} className="image basis-1/4">
                                    <div className='flex justify-between'>
                                        <button
                                            onClick={() =>
                                                removeImg(image)
                                            }
                                        >
                                            x
                                        </button>
                                        <p>{index + 1}</p>
                                    </div>
                                    <img className='shadow sm:rounded-md' src={splitImgData} height="200" alt="upload" />


                                </div>


                            );
                        })

                    })}
            </div>
        </div>

    )
}
