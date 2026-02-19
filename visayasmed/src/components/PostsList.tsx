import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import PostForm, { type Post } from './PostForm.tsx';

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postList: Post[] = [];
      snapshot.forEach((doc) => {
        postList.push({
          id: doc.id,
          ...doc.data(),
        } as Post);
      });
      postList.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(postList);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (post: Post) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      // Delete image from storage if exists
      if (post.imageUrl) {
        try {
          const imageRef = ref(storage, post.imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.log('Could not delete image');
        }
      }

      // Delete post from Firestore
      await deleteDoc(doc(db, 'posts', post.id));
      setMessage('✓ Post deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {!showForm && !editingPost && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          + Create New Post
        </button>
      )}

      {(showForm || editingPost) && (
        <PostForm
          post={editingPost || undefined}
          onSuccess={() => {
            setShowForm(false);
            setEditingPost(null);
            setMessage('✓ Post saved successfully!');
            setTimeout(() => setMessage(''), 3000);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
        />
      )}

      {!showForm && !editingPost && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Image</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No posts yet. Create your first post!
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{post.title}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {post.content.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.date}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          disabled={loading}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;
