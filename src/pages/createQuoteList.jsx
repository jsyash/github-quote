import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateQuoteForm() {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate()
    const { logout } = useAuth()
    const handleFileUpload = async () => {
        if (!file) {
            toast.error('Please select an image');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);
        try {
            const response = await axios.post('https://crafto.app/crafto/v1.0/media/assignment/upload', formData);
            localStorage.setItem('media', response.data[0].url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Image upload failed');
            console.error('Image upload failed', error);
            if (error.response.data.error === "Invalid token") {
                localStorage.clear('tokenLogin')
                toast.error('Please Re Login Your Session Expired')
                setTimeout(() => {
                    navigate("/")
                }, 200)
            }
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async () => {
        const token = localStorage.getItem('tokenLogin');
        const mediaUrl = localStorage.getItem('media');

        if (!text || !mediaUrl) {
            toast.error('Please fill in the quote text and upload an image');
            return;
        }
        setCreating(true)
        try {
            await axios.post(
                'https://assignment.stage.crafto.app/postQuote',
                { text, mediaUrl },
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Quote Created Successfully');
            setText('');
            localStorage.removeItem('media');
            setTimeout(() => {
                navigate('/quotes');
            }, 1000);
            setCreating(false)
        } catch (error) {
            toast.error('Failed to create quote');
            if (error.response.data.error === "Invalid token") {
                toast.error('Please Re Login Your Session Expired')
                setTimeout(() => {
                    logout()
                }, 200)
            }
            setCreating(false)
            console.error('Failed to create quote', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create a Quote</h2>
                <div className="mb-4">
                    <label htmlFor="quoteText" className="block text-gray-700 font-medium mb-2">Quote Text</label>
                    <input
                        id="quoteText"
                        type="text"
                        placeholder="Enter your quote"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="fileUpload" className="block text-gray-700 font-medium mb-2">Upload Image</label>
                    <input
                        id="fileUpload"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full p-2 border rounded-md focus:outline-none"
                    />
                </div>

                <div className="flex justify-between items-center gap-2 mt-6">
                    <button
                        onClick={handleFileUpload}
                        className={`px-4 py-2 bg-indigo-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-700 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload Image'}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={creating}
                        className={`px-4  py-2 ${creating ? "bg-gray-200" : "bg-green-500"} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all`}
                    >
                        {creating ? "Creating...." : "Create Quote"}
                    </button>
                </div>
            </div>
            <Toaster />
        </div>
    );
}

export default CreateQuoteForm;
