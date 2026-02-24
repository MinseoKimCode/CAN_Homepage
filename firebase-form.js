/* =======================================
   CAN - Firebase Firestore 지원서 저장
   firebase-form.js
   ※ firebaseConfig 값을 반드시 채워주세요
======================================= */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── 폼 제출 처리 ──────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name      = document.getElementById('name').value.trim();
  const studentId = document.getElementById('studentId').value.trim();
  const dept      = document.getElementById('dept').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const interest  = document.getElementById('interest').value;
  const message   = document.getElementById('message').value.trim();

  if (!name || !studentId) return;

  submitBtn.textContent = '처리 중...';
  submitBtn.disabled    = true;

  try {
    // ① 학번 중복 확인 (Firestore 문서 ID = 학번)
    const docRef  = doc(db, 'applications', studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      showToast('이미 지원된 학번입니다. 중복 지원은 불가합니다.');
      return;
    }

    // ② 지원서 저장
    await setDoc(docRef, {
      name,
      studentId,
      dept,
      phone,
      interest,
      message,
      submittedAt: serverTimestamp()
    });

    contactForm.reset();
    showToast(`${name}님의 지원서가 접수되었습니다! 빠른 시일 내에 연락드리겠습니다.`);

  } catch (err) {
    console.error('지원서 제출 오류:', err);
    showToast('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    submitBtn.textContent = '지원하기';
    submitBtn.disabled    = false;
  }
});
