import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { setSearchedQuery } from '../redux/jobSlice';
import { FiSearch } from 'react-icons/fi';  
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs, searchedQuery } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs || []);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6; // Show 6 jobs per page
  const totalPages = Math.ceil(filterJobs.length / jobsPerPage);

  useEffect(() => {
      if (searchedQuery) {
          const filteredJobs = allJobs.filter((job) => {
              return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                  job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                  job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                  job.jobType.toLowerCase().includes(searchedQuery.toLowerCase());        
          });
          setFilterJobs(filteredJobs);
      } else {
          setFilterJobs(allJobs);
      }
  }, [allJobs, searchedQuery]);

  // Pagination Logic
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const displayedJobs = filterJobs.slice(startIndex, endIndex);

  // Handle Next and Prev Clicks
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div>
      <Navbar/>

      {/* Search Bar */}
      <div className='max-w-7xl mx-auto mt-5 flex justify-center'>
        <div className="relative w-1/2">
          <input 
            type="text"
            placeholder="Search..."
            className="w-full p-3 pl-5 pr-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-600"
            value={searchedQuery}
            onChange={(e) => dispatch(setSearchedQuery(e.target.value))}
          />
          <button className="absolute right-2 top-2 bg-gray-900 text-white rounded-full p-2 hover:bg-gray-700">
            <FiSearch size={20} />
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto mt-5'>
        <div className='flex gap-5'>
            <div className='w-25'>
              <FilterCard/>
            </div>
            <div className='flex-1 pb-5'>
              {
                displayedJobs.length === 0 ? (
                  <span>No jobs found</span>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {displayedJobs.map((job) => (
                      <motion.div 
                        initial={{opacity:0, x:100}}
                        animate={{opacity:1, x:0}}
                        exit={{opacity:0, x:-100}}
                        transition={{duration:0.3}}
                        key={job?._id}
                      >
                        <Job job={job} />
                      </motion.div>
                    ))}
                  </div>
                )
              }

              {/* Slider Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-5 space-x-4">
                  <button 
                    className={`px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`} 
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  >
                    <FaArrowLeft />
                  </button>
                  <span className="text-lg font-semibold">{currentPage} / {totalPages}</span>
                  <button 
                    className={`px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`} 
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}

            </div>
        </div>
      </div>   
    </div>
  )
}

export default Jobs;
