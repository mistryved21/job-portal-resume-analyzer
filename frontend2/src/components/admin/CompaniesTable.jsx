import { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal, Trash2, FileText } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { setCompanies } from '@/redux/companySlice';

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [filterCompany, setFilterCompany] = useState(companies);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 5;

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);

    // Calculate the current companies to show
    const indexOfLastCompany = currentPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    const currentCompanies = filterCompany.slice(indexOfFirstCompany, indexOfLastCompany);

    // Pagination handler
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filterCompany.length / companiesPerPage);

    const handleDelete = async (companyId) => {
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, { withCredentials: true });
            if (res.data.success) {
                toast.success("Company deleted successfully!");
                dispatch(setCompanies(companies.filter(company => company._id !== companyId)));
            } else {
                toast.error(res.data.message || "Failed to delete company");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while deleting the company");
        }
    };

    const handleDownloadCSV = async (companyId) => {
        try {
            const response = await axios.get(`${COMPANY_API_END_POINT}/export/${companyId}`, {
                withCredentials: true,
                responseType: "blob"
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: "text/csv" });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = `CompanyApplicants_${companyId}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("CSV file downloaded successfully!");
            } else {
                toast.error("Failed to generate CSV file.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error downloading CSV file.");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                        <TableHead className="text-right">Reports</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentCompanies.map((company) => (
                        <TableRow key={company._id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={company.logo} />
                                </Avatar>
                            </TableCell>
                            <TableCell>{company.name}</TableCell>
                            <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                            <Edit2 className='w-4' />
                                            <span>Edit</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                            <TableCell className="text-right flex justify-end">
                                <button 
                                    onClick={() => handleDelete(company._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-700"
                                >
                                    <Trash2 className="w-4" />
                                    Delete
                                </button>
                            </TableCell>
                            <TableCell className="text-right justify-items-end">
                                <button
                                    onClick={() => handleDownloadCSV(company._id)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700"
                                >
                                    <FileText className="w-4" />
                                    Download CSV
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`px-3 py-1 mx-1 rounded-md ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CompaniesTable;
