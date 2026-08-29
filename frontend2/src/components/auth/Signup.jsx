import { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        address: "",
        gender: "",
        date: "",
        file: ""
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const validateFields = () => {
        if (!input.fullname.trim()) return "Full Name is required.";
        if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email format.";
        if (!input.phoneNumber.match(/^\d{10}$/)) return "Phone Number must be 10 digits.";
        if (input.password.length < 6) return "Password must be at least 6 characters.";
        if (!input.role) return "Please select a role.";
        if (!input.gender) return "Please select a gender.";
        if (!input.address.trim()) return "Address is required.";
        if (!input.date) return "Please select your Date of Birth.";
        return null;
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const errorMessage = validateFields();
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        formData.append("address", input.address);
        formData.append("gender", input.gender);
        formData.append("date", input.date);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form 
                    onSubmit={submitHandler} 
                    className="w-1/2 border border-gray-200 shadow-lg rounded-lg p-6 my-10 bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                    <h1 className="font-bold text-xl mb-5 text-center">Sign Up</h1>
                    
                    <div className="my-2">
                        <Label>Full Name</Label>
                        <Input 
                            type="text" 
                            value={input.fullname} 
                            name="fullname" 
                            onChange={changeEventHandler} 
                            placeholder="John Doe" 
                            className="focus:ring-2 focus:ring-blue-400 border transition-all"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Email</Label>
                        <Input 
                            type="email" 
                            value={input.email} 
                            name="email" 
                            onChange={changeEventHandler} 
                            placeholder="johndoe@gmail.com" 
                            className="focus:ring-2 focus:ring-blue-400 border transition-all"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Phone Number</Label>
                        <Input 
                            type="text" 
                            value={input.phoneNumber} 
                            name="phoneNumber" 
                            onChange={changeEventHandler} 
                            placeholder="8080808080" 
                            className="focus:ring-2 focus:ring-blue-400 border transition-all"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Password</Label>
                        <Input 
                            type="password" 
                            value={input.password} 
                            name="password" 
                            onChange={changeEventHandler} 
                            placeholder="Enter strong password" 
                            className="focus:ring-2 focus:ring-blue-400 border transition-all"
                        />
                    </div>

                    <div className="my-2">
                        <Label>DOB</Label>
                        <Input 
                            type="date" 
                            value={input.date} 
                            name="date" 
                            onChange={changeEventHandler} 
                            className="focus:ring-2 focus:ring-blue-400 border transition-all"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Address</Label>
                        <Input 
                            type="text" 
                            value={input.address} 
                            name="address" 
                            onChange={changeEventHandler} 
                            placeholder="123 Street, City" 
                            className="focus:ring-2 focus:ring-blue-400 border transition-all"
                        />
                    </div>

                    <div className="my-2">
                        <Label>Gender</Label>
                        <select name="gender" value={input.gender} onChange={changeEventHandler} className="w-md border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400">
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input 
                                    type="radio" 
                                    name="role" 
                                    value="user" 
                                    checked={input.role === 'user'} 
                                    onChange={changeEventHandler} 
                                    className="cursor-pointer transition-all hover:ring-2 hover:ring-blue-400"
                                />
                                <Label>User</Label>
                            </div>
                        </RadioGroup>
                        
                        <div className="flex items-center gap-2">
                            <Label>Profile</Label>
                            <Input 
                                accept="image/*" 
                                type="file" 
                                onChange={changeFileHandler} 
                                className="cursor-pointer opacity-80 hover:opacity-100 transition-all"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full my-4 bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Signup"}
                    </Button>

                    <span className="text-sm flex justify-center">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 ml-1">Login</Link></span>
                </form>
            </div>
        </div>
    );
};

export default Signup;
