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
            // setFiles(prevState => [...prevState, file])
            return (URL.createObjectURL(file))
        });
        // onSelectFileUpload(selectedFiles)
        setSelectedImages((previousImages) => previousImages.concat(imagesArray));

    };

    // console.log('files consol', files);

    const [images, setImages] = useState([])
    const [URLs, setURLs] = useState([])

    const onSelectFileUpload = (e) => {
        onSelectFile(e)
        for (let i = 0; i < e.target.files.length; i++) {
            const files = e.target.files[i];
            files["id"] = Math.random()
            setImages((prevState) => [...prevState, files])
        }

    };

    console.log('imges', images);





    const uploadFiles = (files) => {
        console.log('dhok c in uploadFiles e', files);
        // const promises = []
        files.map((file) => {

            const sotrageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(sotrageRef, file);
            // promises.push(uploadTask)
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
        // Promise.all(promises)
        //     .then(() => alert('success'))
        //     .then(err => console.log(err))


    };


    const handleSubmitForm = (e) => {
        uploadFiles(images)
        e.preventDefault()

    }


    return (

        <div className="shadow sm:rounded-md sm:overflow-hidden bg-white px-4 py-5 bg-white space-y-6 sm:p-6">
            <span>{progress}</span>
            <form onSubmit={handleSubmitForm}>
                <input
                    type="file"
                    name="images"
                    onChange={onSelectFileUpload}
                    multiple
                    accept="image/png , image/jpeg, image/webp"
                />

                <div className=" py-3 text-right ">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent drop-shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Publish</button>
                </div>
            </form>

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
                    selectedImages.map((image, index) => {

                        return (

                            <div key={image} className="image basis-1/4">
                                <div className='flex justify-between'>
                                    {/* <button
                                        onClick={() =>
                                            removeImg(image)
                                        }
                                    >
                                        x
                                    </button> */}
                                    <p>{index + 1}</p>
                                </div>
                                <img className='shadow sm:rounded-md' src={image} height="200" alt="upload" />


                            </div>


                        );


                    })}
            </div>
        </div>

    )
}
