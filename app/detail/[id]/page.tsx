'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/app/components/Header/page';
import styles from './Detail.module.css';

interface Todo {
  _id: string;
  title: string;
  memo: string;
  imageUrl?: string;
  isCompleted: boolean;
}

export default function TodoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editBtnHover, setEditBtnHover] = useState(false);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await fetch(`/api/todos/${id}`);
        if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
        const data: Todo = await res.json();
        setTodo(data);
        setTitle(data.title);
        setMemo(data.memo ?? '');
        setIsCompleted(data.isCompleted);
        setSavedImageUrl(data.imageUrl ?? null);
      } catch (err) {
        console.error(err);
        alert('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTodo();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      e.target.value = '';
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return savedImageUrl;

    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        typeof data.error === 'string' ? data.error : '이미지 업로드에 실패했습니다.'
      );
    }
    return data.imageUrl as string;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('할 일 제목을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      const uploadedImageUrl = await uploadImage();

      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          memo: memo.trim(),
          imageUrl: uploadedImageUrl,
          isCompleted,
        }),
      });

      if (!res.ok) throw new Error('수정 실패');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : '수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = () => {
    setIsCompleted((prev) => !prev);
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제할까요?')) return;

    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다.');
    }
  };

  const displayImage = previewUrl ?? savedImageUrl;
  const showEditActive = saving || editBtnHover;

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>불러오는 중...</div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>할 일을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.inner}>
        <div className={styles.titleRow}>
          <button
            type="button"
            className={styles.circle}
            onClick={handleToggleComplete}
            aria-label={isCompleted ? '완료 취소' : '완료'}
          >
            <Image
              src={
                isCompleted
                  ? '/icons/Property 1=Frame 2610233.svg'
                  : '/icons/Property 1=Default.svg'
              }
              alt=""
              width={24}
              height={24}
            />
          </button>
          <input
            type="text"
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="할 일 제목을 입력하세요"
            aria-label="할 일 제목"
          />
        </div>

        <div className={styles.content}>
          <section className={styles.imageSection} aria-label="이미지 업로드">
            <div
              className={styles.imageBox}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
              role="button"
              tabIndex={0}
              aria-label="이미지 선택"
            >
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImage} alt="할 일 이미지" className={styles.preview} />
              ) : (
                <div className={styles.placeholder}>
                  <Image src="/imgs/img.png" alt="" width={64} height={64} />
                </div>
              )}
              <button
                type="button"
                className={styles.addBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                aria-label="이미지 추가"
              >
                <Image src="/imgs/Type=Plus.png" alt="" width={64} height={64} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif"
                className={styles.hiddenInput}
                onChange={handleImageChange}
              />
            </div>
          </section>

          <section className={styles.memoSection} aria-label="메모">
            <div className={styles.memoBox}>
              <span className={styles.memoLabel}>Memo</span>
              <textarea
                className={styles.memoInput}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요"
                aria-label="메모"
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleSave}
                disabled={saving}
                onMouseEnter={() => setEditBtnHover(true)}
                onMouseLeave={() => setEditBtnHover(false)}
                onFocus={() => setEditBtnHover(true)}
                onBlur={() => setEditBtnHover(false)}
                aria-label="수정 완료"
              >
                <Image
                  src={
                    showEditActive
                      ? '/imgs/Type=Edit, Size=Large, State=Active.png'
                      : '/imgs/Type=Edit, Size=Large, State=Default.png'
                  }
                  alt="수정 완료"
                  width={168}
                  height={56}
                />
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleDelete}
                disabled={saving}
                aria-label="삭제하기"
              >
                <Image
                  src="/imgs/Type=Delete, Size=Large, State=Default.png"
                  alt="삭제하기"
                  width={168}
                  height={56}
                />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
