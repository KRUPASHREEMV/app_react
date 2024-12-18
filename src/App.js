import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";

const App = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const JOBS_PER_PAGE = 6;

  // Fetch job IDs
  useEffect(() => {
    const fetchJobIds = async () => {
      try {
        const response = await axios.get(
          "https://hacker-news.firebaseio.com/v0/jobstories.json"
        );
        setJobIds(response.data);
      } catch (err) {
        setError("Failed to load job IDs");
      }
    };
    fetchJobIds();
  }, []);

  // Fetch job details for the current page
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const start = (currentPage - 1) * JOBS_PER_PAGE;
        const end = start + JOBS_PER_PAGE;
        const jobPromises = jobIds.slice(start, end).map((id) =>
          axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        );
        const jobResults = await Promise.all(jobPromises);
        setJobs((prevJobs) => [...prevJobs, ...jobResults.map((res) => res.data)]);
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (jobIds.length > 0) fetchJobs();
  }, [currentPage, jobIds]);

  // Load more jobs
  const loadMoreJobs = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Hacker News Job Board
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      {jobs.map((job) => (
        <Card key={job.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {job.url ? (
                <Link href={job.url} target="_blank" rel="noopener noreferrer">
                  {job.title}
                </Link>
              ) : (
                job.title
              )}
            </Typography>
            <Typography variant="subtitle2">Posted by: {job.by}</Typography>
            <Typography variant="body2">
              Date Posted: {format(new Date(job.time * 1000), "PPpp")}
            </Typography>
          </CardContent>
        </Card>
      ))}
      {loading && (
        <CircularProgress sx={{ display: "block", margin: "16px auto" }} />
      )}
      {!loading && jobIds.length > jobs.length && (
        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={loadMoreJobs}
        >
          Load More
        </Button>
      )}
    </Container>
  );
};

export default App;
