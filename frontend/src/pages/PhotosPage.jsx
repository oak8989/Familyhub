import React, { useState, useEffect, useRef } from 'react';
import { Image, Plus, Trash2, X, Upload } from 'lucide-react';
import { photosAPI } from '../lib/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const response = await photosAPI.getPhotos();
      setPhotos(response.data);
    } catch (error) {
      toast.error('Failed to load photos');
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        
        await photosAPI.uploadPhoto(formData);
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setDescription('');
    setUploading(false);
    loadPhotos();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    try {
      await photosAPI.deletePhoto(id);
      setSelectedPhoto(null);
      loadPhotos();
      toast.success('Photo deleted');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  return (
    <div className="space-y-6" data-testid="photos-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy flex items-center gap-3">
            <Image className="w-8 h-8 text-rose-400" />
            Family Photos
          </h1>
          <p className="text-navy-light mt-1">{photos.length} memories</p>
        </div>
        
        <div className="flex gap-3 items-center">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Photo description..."
            className="input-cozy w-48"
            data-testid="photo-description"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            data-testid="photo-file-input"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary"
            data-testid="upload-photo-btn"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Photo grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : photos.length === 0 ? (
        <div className="card-cozy text-center py-12">
          <Image className="w-16 h-16 text-sunny mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-navy mb-2">No photos yet</h3>
          <p className="text-navy-light font-handwritten text-lg mb-4">
            Upload photos to share with your family!
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Photo
          </Button>
        </div>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="photo-item relative group"
              onClick={() => setSelectedPhoto(photo)}
              data-testid={`photo-${photo.id}`}
            >
              <img
                src={photosAPI.getPhotoUrl(photo.id)}
                alt={photo.description || 'Family photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-sm truncate">
                  {photo.description || new Date(photo.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo viewer dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="bg-warm-white border-sunny/50 max-w-4xl p-0 overflow-hidden">
          {selectedPhoto && (
            <>
              <div className="relative">
                <img
                  src={photosAPI.getPhotoUrl(selectedPhoto.id)}
                  alt={selectedPhoto.description || 'Family photo'}
                  className="w-full max-h-[70vh] object-contain bg-navy/5"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  {selectedPhoto.description && (
                    <p className="text-navy font-medium">{selectedPhoto.description}</p>
                  )}
                  <p className="text-sm text-navy-light">
                    Uploaded {new Date(selectedPhoto.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(selectedPhoto.id)}
                  className="text-red-500 hover:bg-red-50"
                  data-testid="delete-photo-btn"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosPage;
