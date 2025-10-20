/* eslint-disable react/no-this-in-sfc */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import ReactFileReader from "react-file-reader";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { instance } from '../../config/Http';
import './blog.css';



export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;
  img {
    width: 186px;
    height: 186px;
    object-fit: cover;
    border-radius: 50%;
  }
  .circle {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
  label {
    right: 23em !important;
    position: absolute;
    width: 48px;
    height: 48px;
    background: #312e38;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      display: none;
    }
    svg {
      width: 20px;
      height: 20px;
      color: #f4ede8;
    }
    &:hover {
      background: blue;
    }
  }
`;

const AddBlog = () => {
    const [title, setTitle] = useState('');
    const [Desc, setDesc] = useState('');
    const [Error, setError] = useState('');
    const [image, setImage] = useState('');
    const [loader, setLoader] = useState(false);
    const [url, setUrl] = useState("https://i.imgur.com/ndu6pfe.png");
    const [value, setValue] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const quillRef = React.useRef(null);

    const imageHandler = React.useCallback(() => {
        
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('multiple', 'true');
        input.click();

        input.onchange = async () => {
            setLoader(true);
            const files = Array.from(input.files);
            if (files.length > 0) {
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.blur();  // Temporary blur to ensure focus isn't lost after insertion

                const uploadPromises = files.map(file => {
                    const formData = new FormData();
                    formData.append('image', file);

                    return instance.post('/admin/upload-image', formData)
                        .then(result => 
                            result?.data?.image
                        )
                        .catch(error => {
                            setLoader(false);
                            console.error('Error:', error);
                            return null;
                        });
                });

                const urls = await Promise.all(uploadPromises);
                urls.forEach(url => {
                    if (url) {
                        setImageUrls(prevUrls => [...prevUrls, url]);
                        editor.insertEmbed(range.index, 'image', url);
                        editor.setSelection(range.index + 1);  // Move cursor to the right of the inserted image
                    }
                });

                editor.focus(); 
                setLoader(false);
                 // Restore focus after insertion
            }
        };
    }, []);

    const handleFiles = (files) => {
        setUrl(files.base64);
        setImage(files?.fileList[0]);
    };



    console.log(imageUrls, 'imageUrls');

    const Navigate = useNavigate();

    const token = localStorage.getItem('accessToken');

    const AddPost = () => {
        setLoader(true);
        console.log(imageUrls, value, 'imageUrls');
        try {
            const Blog = new FormData();
            Blog.append('title', title);
            Blog.append('image', image);
            Blog.append('discription', value);

            instance.post(`admin/post`, Blog).then((response) => {
                console.log(response, 'working');
                const status = response?.data?.status;
                setLoader(false);

                if (status === true) {
                    Swal.fire({
                        title: 'Good job!',
                        text: 'Blog Add SuccessFully!',
                        icon: 'success',
                        button: 'Ok',
                    });
                    Navigate('/dashboard/user');
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            });
        } catch (error) {
            setLoader(false);
            console.log(error?.message);
            Swal.fire({
                title: 'Something Went Wrong',
                text: error?.message,
                icon: 'error',
                dangerMode: true,
            });
        }
    };


    return (
        <>
            <Helmet>
                <title> Add Blog | Assignment Help </title>
            </Helmet>
            <Backdrop sx={{ color: 'red', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Card style={{ width: '80%', margin: 'auto' }}>
                <CardContent>
                    <h1 color="text.secondary">Add Blog</h1>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <AvatarInput>
                            <img src={url} alt="Avatar Placeholder" />
                        </AvatarInput>
                        <ReactFileReader
                            fileTypes={[".png", ".jpg"]}
                            base64={true}
                            handleFiles={handleFiles}
                        >
                            <Button variant="contained" as={Button} fullWidth sx={{ backgroundColor: 'red', padding: '16px 10px', marginBottom: '20px' }} startIcon={<CloudUploadIcon icon="eva:plus-fill" />}>
                                Upload Image
                            </Button>
                        </ReactFileReader>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '100%',
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Title"
                            id="fullWidth"
                            placeholder="Enter Title"
                            sx={{ mb: 2 }}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <p className="text-danger">{Error?.title}</p>
                    </Box>
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        ref={quillRef}
                        modules={{
                            toolbar: {
                                container: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ size: [] }],
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                    ['link', 'image', 'video'],
                                    ['clean']
                                ],
                                handlers: {
                                    'image': imageHandler
                                }
                            }
                        }}
                        formats={[
                            'header', 'font', 'size',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent',
                            'link', 'image', 'video'
                        ]}
                    />

                </CardContent>
                <CardActions>
                    <Button size="large" variant="contained" sx={{ backgroundColor: '#ff5a3c', my: 2 }} onClick={AddPost}>
                        Add Blog
                    </Button>
                </CardActions>
            </Card>
        </>
    );
};

export default AddBlog;
