// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./Dashboard.scss";

interface Video {
  _id: string;
  title: string;
  url: string;
  cloudinaryId: string;
  createdAt: string;
}

const Dashboard = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/get-user-videos");

        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setVideos(data.videos);
        } else {
          throw new Error(data.error || "Failed to fetch videos");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching videos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle video deletion
  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/delete-video?id=${videoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`);
      }

      // Remove the deleted video from state
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));

      // If the active video was deleted, clear it
      if (activeVideo?._id === videoId) {
        setActiveVideo(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      alert(`Error deleting video: ${errorMessage}`);
      console.error('Error deleting video:', err);
    }
  };


  // Filter and sort videos
  const filteredAndSortedVideos = videos
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      if (sortBy === "newest") {
        return dateB - dateA;
      } else if (sortBy === "oldest") {
        return dateA - dateB;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <h1>My Videos</h1>
          <div className="dashboard__user-menu">
            <Link href="/EditVideo" className="btn btn--primary">
              New Video
            </Link>
            <UserButton  />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard__content">
        {/* Filter and Sort Controls */}
        <div className="dashboard__controls">
          <div className="dashboard__search">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dashboard__search-input"
            />
          </div>
          <div className="dashboard__sort">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="dashboard__sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="dashboard__loading">
            <div className="spinner">
              <svg
                viewBox="0 0 1024 1024"
                focusable="false"
                data-icon="loading"
                width="3em"
                height="3em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
              </svg>
            </div>
            <p>Loading your videos...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="dashboard__error">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
            <button 
              className="btn btn--secondary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && videos.length === 0 && (
          <div className="dashboard__empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <h2>No videos yet</h2>
            <p>Create your first video in the editor</p>
            <Link href="/EditVideo" className="btn btn--primary">
              Create Video
            </Link>
          </div>
        )}

        {/* No Results for Search */}
        {!isLoading && !error && videos.length > 0 && filteredAndSortedVideos.length === 0 && (
          <div className="dashboard__no-results">
            <p>No videos match your search for &quot;{searchTerm}&quot;</p>
            <button 
              className="btn btn--secondary" 
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Video Grid */}
        {!isLoading && !error && filteredAndSortedVideos.length > 0 && (
          <div className="dashboard__video-grid">
            {filteredAndSortedVideos.map((video) => (
              <div 
                key={video.cloudinaryId} 
                className={`video-card ${activeVideo?._id === video._id ? 'video-card--active' : ''}`}
                onClick={() => setActiveVideo(video)}
              >
                <div className="video-card__thumbnail">
                  {/* Video Thumbnail - using the actual video as thumbnail */}
                  <video 
                    src={video.url} 
                    muted 
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()} 
                    onMouseOut={(e) => {
                      (e.target as HTMLVideoElement).pause();
                      (e.target as HTMLVideoElement).currentTime = 0;
                    }}
                  ></video>
                  
                  <div className="video-card__overlay">
                    <button 
                      className="video-card__play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVideo(video);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="video-card__info">
                  <h3 className="video-card__title">{video.title}</h3>
                  <p className="video-card__date">{formatDate(video.createdAt)}</p>
                  
                  <div className="video-card__actions">
                    <button 
                      className="video-card__action-btn video-card__action-btn--delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(video._id);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                    <a 
                      href={video.url}
                      className="video-card__action-btn"
                      download
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideo && (
          <div 
            className="video-modal"
            onClick={() => setActiveVideo(null)}
          >
            <div 
              className="video-modal__content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="video-modal__close"
                onClick={() => setActiveVideo(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <h2 className="video-modal__title">{activeVideo.title}</h2>
              
              <div className="video-modal__player">
                <video 
                  src={activeVideo.url} 
                  controls 
                  autoPlay
                ></video>
              </div>
              
              <div className="video-modal__info">
                <p>Created on {formatDate(activeVideo.createdAt)}</p>
                
                <div className="video-modal__actions">
                  <a 
                    href={activeVideo.url}
                    className="btn btn--primary"
                    download
                  >
                    Download
                  </a>
                  <button 
                    className="btn btn--danger"
                    onClick={() => {
                      handleDeleteVideo(activeVideo._id);
                      setActiveVideo(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;