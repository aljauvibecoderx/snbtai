import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Heart, MessageCircle, Trash2, X } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UnifiedNavbar } from './UnifiedNavbar';

const storage = getStorage();

export const CommunityView = ({ onBack, user, onLogin }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File maksimal 2MB');
      return;
    }

    setMediaFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!newPost.trim() && !mediaFile) return;
    if (!user) {
      alert('Login dulu untuk posting');
      return;
    }

    setUploading(true);
    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        const fileName = `${Date.now()}_${mediaFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `posts/${fileName}`);
        await uploadBytes(storageRef, mediaFile);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
      }

      await addDoc(collection(db, 'posts'), {
        text: newPost,
        mediaUrl,
        mediaType,
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        likes: [],
        comments: [],
        createdAt: serverTimestamp()
      });

      setNewPost('');
      setMediaFile(null);
      setMediaPreview(null);
    } catch (error) {
      console.error('Post error:', error);
      alert('Gagal posting: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (postId, likes) => {
    if (!user) return;
    const postRef = doc(db, 'posts', postId);
    
    try {
      if (likes.includes(user.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(user.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleReply = async (postId) => {
    if (!replyText.trim() || !user) return;
    
    try {
      const postRef = doc(db, 'posts', postId);
      const comment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        text: replyText,
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });
      
      setReplyText('');
      setReplyTo(null);
    } catch (error) {
      console.error('Reply error:', error);
      alert('Gagal reply');
    }
  };

  const handleDelete = async (postId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Baru saja';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}d`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j`;
    return `${Math.floor(diff / 86400)}h`;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Unified Navbar */}
      <UnifiedNavbar
        user={user}
        onLogin={onLogin}
        onLogout={() => {}}
        navigate={() => {}}
        setView={() => {}}
        dailyUsage={0}
        totalQuestionsInBank={0}
        remainingQuota={0}
        isAdmin={false}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        variant="community"
      />
      
      {loading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm font-medium">Memuat Community...</p>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 relative z-10 pt-32">
        {!user && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
            <p className="text-slate-600 mb-4">Login untuk mulai posting dan berinteraksi</p>
            <button onClick={onLogin} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-all">
              Login dengan Google
            </button>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4 pb-24">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-scale-in">
              <div className="flex items-start gap-3">
                <img src={post.userPhoto} alt={post.userName} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{post.userName}</span>
                      <span className="text-slate-500 text-xs ml-2">{formatTime(post.createdAt)}</span>
                    </div>
                    {user?.uid === post.userId && (
                      <button onClick={() => handleDelete(post.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {post.text && (
                    <p className="text-slate-700 text-sm mt-2 leading-relaxed whitespace-pre-wrap">{post.text}</p>
                  )}

                  {post.mediaUrl && (
                    <div className="mt-3">
                      {post.mediaType === 'image' ? (
                        <img src={post.mediaUrl} alt="Post media" className="w-full rounded-lg max-h-96 object-cover" />
                      ) : (
                        <video src={post.mediaUrl} controls className="w-full rounded-lg max-h-96" />
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleLike(post.id, post.likes || [])}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        post.likes?.includes(user?.uid) ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart size={18} fill={post.likes?.includes(user?.uid) ? 'currentColor' : 'none'} />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => setReplyTo(replyTo === post.id ? null : post.id)}
                      className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-500 transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-slate-100">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <img src={comment.userPhoto} alt={comment.userName} className="w-6 h-6 rounded-full" />
                          <div className="flex-1">
                            <div className="bg-slate-50 rounded-lg p-2">
                              <span className="font-bold text-slate-900 text-xs">{comment.userName}</span>
                              <p className="text-slate-700 text-xs mt-1">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyTo === post.id && user && (
                    <div className="mt-3 flex gap-2">
                      <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleReply(post.id)}
                          placeholder="Tulis balasan..."
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <button
                          onClick={() => handleReply(post.id)}
                          disabled={!replyText.trim()}
                          className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-500">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Belum ada postingan. Jadilah yang pertama!</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Post Input at Bottom */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-30 relative">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex gap-3">
              <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
              <div className="flex-1 relative">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (newPost.trim() || mediaFile) handlePost();
                    }
                  }}
                  placeholder="Tulis sesuatu..."
                  rows="3"
                  className="w-full px-3 py-2 pr-20 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    disabled={uploading}
                    title="Upload gambar/video"
                  >
                    <Image size={18} />
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={(!newPost.trim() && !mediaFile) || uploading}
                    className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                    title="Kirim (Enter)"
                  >
                    {uploading ? '...' : <Send size={18} />}
                  </button>
                </div>
                {mediaPreview && (
                  <div className="relative mt-2">
                    <button
                      onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      <X size={12} />
                    </button>
                    {mediaFile?.type.startsWith('image/') ? (
                      <img src={mediaPreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                    ) : (
                      <video src={mediaPreview} className="w-20 h-20 rounded-lg object-cover" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
