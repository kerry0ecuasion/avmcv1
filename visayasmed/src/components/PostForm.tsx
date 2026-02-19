import React, { useState } from 'react';
import { doc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  createdAt: number;
};

interface PostFormProps {
  post?: Post;
  onSuccess: () => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSuccess, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(post?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = post?.imageUrl || '';

      // Upload new image if selected
      if (selectedFile && !previewUrl?.startsWith('http')) {
        const imageName = `posts/${Date.now()}-${selectedFile.name}`;
        const imageRef = ref(storage, imageName);
        await uploadBytes(imageRef, selectedFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (post) {
        // Update existing post
        await updateDoc(doc(db, 'posts', post.id), {
          title,
          content,
          imageUrl,
          date: dateStr,
          updatedAt: Date.now(),
        });
      } else {
        // Create new post with auto-generated ID
        const docRef = doc(collection(db, 'posts'));
        await setDoc(docRef, {
          title,
          content,
          imageUrl,
          date: dateStr,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save post';
      setError(message);
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {post ? 'Edit Post' : 'Create New Post'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Post Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-600"
            placeholder="Enter post title"
            maxLength={200}
          />
          <div className="text-sm text-gray-500 mt-1">{title.length}/200</div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Post Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-600 resize-vertical"
            placeholder="Enter post content..."
            maxLength={5000}
          />
          <div className="text-sm text-gray-500 mt-1">{content.length}/5000</div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Post Image (Optional)</label>
          {previewUrl && (
            <div className="mb-4 flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 object-cover rounded-lg"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <p className="text-sm text-gray-500 mt-1">Max file size: 5MB</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
          >
            {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
