import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import LessonFaq from "./LessonFaq";
import LessonNavTav from "./LessonNavTav";
import LessonVideo from "./LessonVideo";
import LessonQuiz from "./LessonQuiz";
import ScoreProgressBar from "./ScoreProgressBar";
import LessonLoading from "./LessonLoading";
import "./LessonArea.css";

// เพิ่มการใช้ API URL จาก .env
const API_URL = import.meta.env.VITE_API_URL;

// ปรับปรุง interface ให้ตรงกับข้อมูลจาก API
interface LessonItem {
    id: number;
    lesson_id: number;
    title: string;
    lock: boolean;
    completed: boolean;
    type: "video" | "quiz";
    quizType: string,
    duration: string;
    video_url?: string;
    quiz_id?: number;
    quiz?: {
        progress?: {
            passed?: boolean;
            completed?: boolean;
            awaiting_review?: boolean;
        };
        score?: number;
        max_score?: number;
        actual_score?: number;
        type?: string;
        quiz_details?: {
            max_score: number;
            total_questions: number;
            questions_breakdown: {
                question_id: number;
                score: number;
            }[];
        };
    };
    status?: "passed" | "failed" | "awaiting_review";
}

interface SectionData {
    id: number;
    subject_id: number;
    title: string;
    count: string;
    items: LessonItem[];
    quiz_id?: number;
}

interface CourseData {
    course_id: number;
    title: string;
    description: string;
    instructors: Array<{
        instructor_id: number;
        name: string;
        position: string;
        avatar?: string;
        bio?: string;
    }>;
    subjects: {
        subject_id: number;
        title: string;
        description: string;
        lessons: {
            lesson_id: number;
            title: string;
            description: string;
            video_url: string;
            duration: number;
            quiz_id?: number | null;
            is_big_lesson?: boolean;
            big_lesson_id?: number;
            sub_lessons?: {
                lesson_id: number;
                title: string;
                description: string;
                video_url: string;
                duration: number;
                quiz_id?: number | null;
                order_number: number;
                progress?: {
                    video_completed: boolean;
                    quiz_completed: boolean;
                    overall_completed: boolean;
                };
                quiz?: {
                    quiz_id: number;
                    title: string;
                    description: string;
                    type: string;
                    progress?: {
                        completed: boolean;
                        passed: boolean;
                        awaiting_review: boolean;
                    };
                    questions: any[];
                };
            }[];
            progress?: {
                video_completed: boolean;
                quiz_completed: boolean;
                overall_completed: boolean;
            };
            quiz?: {
                quiz_id: number;
                title: string;
                description: string;
                type: string;
                progress?: {
                    completed: boolean;
                    passed: boolean;
                    awaiting_review: boolean;
                };
                questions: any[];
            };
        }[];
    }[];
}

interface LessonAreaProps {
    courseId: number;
    subjectId: number;
}

const LessonArea = ({ courseId, subjectId }: LessonAreaProps) => {
    const [currentView, setCurrentView] = useState<"video" | "quiz">("video");
    const [progress, setProgress] = useState<number>(0);
    const [currentLesson, setCurrentLesson] = useState<string>("");
    const [currentLessonId, setCurrentLessonId] = useState<string>("");
    const [currentSubjectId, setCurrentSubjectId] = useState<number | null>(null);
    const [currentSubjectTitle, setCurrentSubjectTitle] = useState<string>("");
    const [currentLessonData, setCurrentLessonData] = useState<any>(null);
    const [currentQuizData, setCurrentQuizData] = useState<any>(null);
    const [youtubeId, setYoutubeId] = useState<string>("");
    const [lessonData, setLessonData] = useState<SectionData[]>([]);
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [subjectQuizzes, setSubjectQuizzes] = useState<any[]>([]);
    const [initialLessonSet, setInitialLessonSet] = useState<boolean>(false);
    // เพิ่ม state สำหรับควบคุม activeAccordion ใน sidebar
    const [sidebarActiveAccordion, setSidebarActiveAccordion] = useState<number | null>(null);
    // ✅ เพิ่ม state สำหรับ hierarchical score structure
    const [scoreStructure, setScoreStructure] = useState<any>({});
    // ✅ เพิ่ม state สำหรับ subject passing percentage
    const [subjectPassingPercentage, setSubjectPassingPercentage] = useState<number>(80);
    // ✅ เพิ่ม state สำหรับ modal เนื้อหาที่ล็อค
    const [showLockedModal, setShowLockedModal] = useState<boolean>(false);
    const [lockedContentData, setLockedContentData] = useState<any>(null);
    // ✅ เพิ่ม state เพื่อป้องกันการเรียก updatePaymentStatus ซ้ำ
    const [completionStatusSent, setCompletionStatusSent] = useState(false);
    // ✅ เพิ่ม ref เพื่อป้องกันการ refresh ซ้ำ
    const refreshInProgressRef = useRef(false);
    // ✅ เพิ่ม state สำหรับ Debug Modal

    // ✅ ฟังก์ชันสำหรับแสดง modal เนื้อหาที่ล็อค
    const handleShowLockedModal = (data: any) => {
        setLockedContentData(data);
        setShowLockedModal(true);
        
        // ✅ Scroll ไปที่ตำแหน่ง modal และ focus
        setTimeout(() => {
            const modal = document.querySelector('.locked-content-modal');
            if (modal) {
                modal.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'center'
                });
                // Focus ที่ปุ่มปิด modal
                const closeBtn = modal.querySelector('.close-btn') as HTMLElement;
                if (closeBtn) {
                    closeBtn.focus();
                }
            }
        }, 100);
    };

    // ✅ ฟังก์ชันปิด modal
    const handleCloseLockedModal = () => {
        setShowLockedModal(false);
        setLockedContentData(null);
    };

    // ✅ เพิ่ม keyboard navigation สำหรับ modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (showLockedModal) {
                if (event?.key === 'Escape') {
                    handleCloseLockedModal();
                } else if (event?.key === 'Enter' && event.target === document.querySelector('.close-btn')) {
                    handleCloseLockedModal();
                }
            }
        };

        if (showLockedModal) {
            document.addEventListener('keydown', handleKeyDown);
            // ป้องกันการ scroll ของ body เมื่อ modal เปิด
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [showLockedModal]);
    const [showDebugModal, setShowDebugModal] = useState(false);

    // ฟังก์ชันคำนวณคะแนนต่างๆ สำหรับ Real Score System
    const calculateCurrentScore = useCallback((): number => {
        // ใช้ข้อมูลจาก hierarchical score structure
        if (!scoreStructure || !scoreStructure.big_lessons) {
            return 0;
        }
        
        let totalScore = 0;
        
        // ✅ Debug: ดูข้อมูลที่ใช้ในการคำนวณ
        console.log('🔍 calculateCurrentScore - scoreStructure:', scoreStructure);
        
        // คำนวณคะแนนจาก Big Lessons
        scoreStructure.big_lessons.forEach((bigLesson: any) => {
            // คำนวณคะแนนจาก Quiz ใน BigLesson - ใช้ weight_percentage และ progress
            if (bigLesson.quiz && bigLesson.quiz.progress?.passed) {
                // ใช้ weight_percentage เป็นคะแนนที่ได้ (เพราะผ่านแล้ว)
                const quizScore = Number(bigLesson.quiz.weight_percentage || bigLesson.quiz.percentage || 0);
                totalScore += quizScore;
                console.log(`📊 BigLesson Quiz ${bigLesson.quiz.title}: ${quizScore} คะแนน (จาก weight_percentage)`);
            }
            
            // คำนวณคะแนนจาก Lessons ใน BigLesson
            if (bigLesson.lessons) {
                bigLesson.lessons.forEach((lesson: any) => {
                    // คำนวณคะแนนจาก Video completion (Lesson) - ใช้ weight_percentage
                    if (lesson.video_completed === true) {
                        const videoScore = Number(lesson.weight_percentage || lesson.percentage || 0);
                        totalScore += videoScore;
                        console.log(`📹 Lesson Video ${lesson.title}: ${videoScore} คะแนน (จาก weight_percentage)`);
                    }
                    
                    // คำนวณคะแนนจาก Lesson Quiz - ใช้ weight_percentage และ progress
                    if (lesson.quiz && lesson.quiz.progress?.passed) {
                        const lessonQuizScore = Number(lesson.quiz.weight_percentage || lesson.quiz.percentage || 0);
                        totalScore += lessonQuizScore;
                        console.log(`📝 Lesson Quiz ${lesson.quiz.title}: ${lessonQuizScore} คะแนน (จาก weight_percentage)`);
                    }
                });
            }
        });
        
        // คำนวณคะแนนจาก Post-test - ใช้ weight_percentage และ progress
        if (scoreStructure.post_test && scoreStructure.post_test.progress?.passed) {
            const postTestScore = Number(scoreStructure.post_test.weight_percentage || scoreStructure.post_test.percentage || 0);
            totalScore += postTestScore;
            console.log(`🏁 Post-test ${scoreStructure.post_test.title}: ${postTestScore} คะแนน (จาก weight_percentage)`);
        }

        console.log(`🎯 Total Current Score: ${totalScore}`);
        return Math.round(totalScore * 100) / 100;
    }, [scoreStructure]);

    const calculateMaxScore = useCallback((): number => {
        // ใช้ข้อมูลจาก hierarchical score structure
        if (!scoreStructure || !scoreStructure.big_lessons) {
            return 100; // คะแนนเต็มต้องเป็น 100 เสมอ
        }
        
        let maxScore = 0;
        
        // ✅ Debug: ดูข้อมูลที่ใช้ในการคำนวณ
        console.log('🔍 calculateMaxScore - scoreStructure:', scoreStructure);
        
        // คำนวณคะแนนเต็มจาก weight_percentage ของแต่ละ BigLesson
        scoreStructure.big_lessons.forEach((bigLesson: any) => {
            // เพิ่มคะแนนเต็มจาก BigLesson Quiz
            if (bigLesson.quiz) {
                const quizMaxScore = Number(bigLesson.quiz.weight_percentage || bigLesson.quiz.percentage || 0);
                maxScore += quizMaxScore;
                console.log(`📊 BigLesson Quiz ${bigLesson.quiz.title}: max_score = ${quizMaxScore} (จาก weight_percentage)`);
            }
            
            // เพิ่มคะแนนเต็มจาก Lessons ใน BigLesson
            if (bigLesson.lessons) {
                bigLesson.lessons.forEach((lesson: any) => {
                    // เพิ่มคะแนนเต็มจาก Video completion
                    const videoMaxScore = Number(lesson.weight_percentage || lesson.percentage || 0);
                    maxScore += videoMaxScore;
                    console.log(`📹 Lesson Video ${lesson.title}: max_score = ${videoMaxScore} (จาก weight_percentage)`);
                    
                    // เพิ่มคะแนนเต็มจาก Lesson Quiz
                    if (lesson.quiz) {
                        const lessonQuizMaxScore = Number(lesson.quiz.weight_percentage || lesson.quiz.percentage || 0);
                        maxScore += lessonQuizMaxScore;
                        console.log(`📝 Lesson Quiz ${lesson.quiz.title}: max_score = ${lessonQuizMaxScore} (จาก weight_percentage)`);
                    }
                });
            }
        });
        
        // เพิ่มคะแนนเต็มจาก Post-test
        if (scoreStructure.post_test) {
            const postTestMaxScore = Number(scoreStructure.post_test.weight_percentage || scoreStructure.post_test.percentage || 0);
            maxScore += postTestMaxScore;
            console.log(`🏁 Post-test ${scoreStructure.post_test.title}: max_score = ${postTestMaxScore} (จาก weight_percentage)`);
        }

        console.log(`🎯 Total Max Score: ${maxScore}`);
        // ถ้าคำนวณได้ 0 ให้ใช้ 100 แทน
        return maxScore > 0 ? maxScore : 100;
    }, [scoreStructure]);

    const calculatePassingScore = useCallback((): number => {
        const maxScore = calculateMaxScore();
        // ✅ ใช้เกณฑ์ผ่านจาก subject.passing_percentage
        const passingPercentage = subjectPassingPercentage || 80;
        const passingScore = Math.ceil(maxScore * (passingPercentage / 100));
        
        return passingScore;
    }, [calculateMaxScore, subjectPassingPercentage]);

    // ✅ ฟังก์ชันใหม่: คำนวณ Overall Progress ตามที่ User ขอ
    const calculateOverallProgress = useCallback((): number => {
        if (!scoreStructure || !scoreStructure.big_lessons) {
            return 0;
        }
        
        let totalComponents = 0;
        let completedComponents = 0;
        
        // ✅ Debug: ดูข้อมูลที่ใช้ในการคำนวณ
        console.log('🔍 calculateOverallProgress - scoreStructure:', scoreStructure);
        
        // 1. Pre-test (ถ้ามี)
        if (scoreStructure.pre_test) {
            totalComponents++;
            const preTestCompleted = scoreStructure.pre_test.progress?.passed || scoreStructure.pre_test.progress?.completed;
            if (preTestCompleted) {
                completedComponents++;
            }
            console.log(`🎯 Pre-test ${scoreStructure.pre_test.title}: ${preTestCompleted ? 'เสร็จ' : 'ยังไม่เสร็จ'}`);
        }
        
        // 2. Big Lessons Content (ทุกอัน)
        scoreStructure.big_lessons.forEach((bigLesson: any) => {
            // เพิ่ม BigLesson Quiz
            if (bigLesson.quiz) {
                totalComponents++;
                const quizCompleted = bigLesson.quiz.progress?.passed || bigLesson.quiz.progress?.completed;
                if (quizCompleted) {
                    completedComponents++;
                }
                console.log(`📊 BigLesson Quiz ${bigLesson.quiz.title}: ${quizCompleted ? 'เสร็จ' : 'ยังไม่เสร็จ'}`);
            }
            
            // เพิ่ม Lessons ใน BigLesson
            if (bigLesson.lessons) {
                bigLesson.lessons.forEach((lesson: any) => {
                    // เพิ่ม Video completion
                    totalComponents++;
                    if (lesson.video_completed === true) {
                        completedComponents++;
                    }
                    console.log(`📹 Lesson Video ${lesson.title}: ${lesson.video_completed ? 'เสร็จ' : 'ยังไม่เสร็จ'}`);
                    
                    // เพิ่ม Lesson Quiz
                    if (lesson.quiz) {
                        totalComponents++;
                        const lessonQuizCompleted = lesson.quiz.progress?.passed || lesson.quiz.progress?.completed;
                        if (lessonQuizCompleted) {
                            completedComponents++;
                        }
                        console.log(`📝 Lesson Quiz ${lesson.quiz.title}: ${lessonQuizCompleted ? 'เสร็จ' : 'ยังไม่เสร็จ'}`);
                    }
                });
            }
        });
        
        // 3. Post-test
        if (scoreStructure.post_test) {
            totalComponents++;
            const postTestCompleted = scoreStructure.post_test.progress?.passed || scoreStructure.post_test.progress?.completed;
            if (postTestCompleted) {
                completedComponents++;
            }
            console.log(`🏁 Post-test ${scoreStructure.post_test.title}: ${postTestCompleted ? 'เสร็จ' : 'ยังไม่เสร็จ'}`);
        }
        
        // คำนวณเปอร์เซ็นต์เฉลี่ย
        const overallProgress = totalComponents > 0 ? (completedComponents / totalComponents) * 100 : 0;
        console.log(`🎯 Overall Progress: ${completedComponents}/${totalComponents} = ${overallProgress.toFixed(1)}%`);
        return Math.round(overallProgress * 10) / 10; // ปัดเป็นทศนิยม 1 ตำแหน่ง
    }, [scoreStructure]);

    // ✅ ฟังก์ชันใหม่: ตรวจสอบว่าวิชานี้ผ่านหรือไม่ ตามเงื่อนไขใหม่
    const isSubjectPassed = useCallback((): boolean => {
        const currentScore = calculateCurrentScore();
        const passingScore = calculatePassingScore();
        const overallProgress = calculateOverallProgress();
        
        // เงื่อนไขที่ 1: คะแนนต้องมากกว่าเกณฑ์ผ่าน
        const scorePassed = currentScore >= passingScore;
        
        // เงื่อนไขที่ 2: Progress ต้องครบ 100%
        const progressPassed = overallProgress >= 100;
        
        // ต้องผ่านทั้งสองเงื่อนไข
        return scorePassed && progressPassed;
    }, [calculateCurrentScore, calculatePassingScore, calculateOverallProgress]);

    // ฟังก์ชันดึงข้อมูลคะแนนจาก Score Management API (Hierarchical)
    const fetchScoreItems = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            console.log('🔍 fetchScoreItems called with:', { token: !!token, currentSubjectId });
            if (!token || !currentSubjectId) {
                console.log('❌ fetchScoreItems aborted:', { hasToken: !!token, currentSubjectId });
                return;
            }

            const response = await axios.get(
                    `${API_URL}/api/learn/subject/${currentSubjectId}/scores-hierarchical`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success && response.data.scoreStructure) {
                setScoreStructure(response.data.scoreStructure);
                setSubjectPassingPercentage(Number(response.data.subject?.passing_percentage) || 80);
                
                console.log('📊 Hierarchical Score Structure loaded:', response.data.scoreStructure);
                
                // ✅ เพิ่มการ log ข้อมูลคะแนนที่ได้มา
                console.group('🔍 ข้อมูลคะแนนที่ได้จาก API');
                if (response.data.scoreStructure.pre_test) {
                    console.log('🎯 Pre-test:', {
                        title: response.data.scoreStructure.pre_test.title,
                        weight_percentage: response.data.scoreStructure.pre_test.weight_percentage,
                        percentage: response.data.scoreStructure.pre_test.percentage,
                        progress: response.data.scoreStructure.pre_test.progress
                    });
                }
                
                if (response.data.scoreStructure.big_lessons) {
                    response.data.scoreStructure.big_lessons.forEach((bl: any, index: number) => {
                        console.log(`📚 BigLesson ${index + 1}:`, {
                            title: bl.title,
                            weight_percentage: bl.weight_percentage,
                            percentage: bl.percentage,
                            quiz: bl.quiz ? {
                                title: bl.quiz.title,
                                weight_percentage: bl.quiz.weight_percentage,
                                percentage: bl.quiz.percentage,
                                progress: bl.quiz.progress
                            } : null,
                            lessons: bl.lessons?.map((l: any) => ({
                                title: l.title,
                                weight_percentage: l.weight_percentage,
                                percentage: l.percentage,
                                video_completed: l.video_completed,
                                quiz: l.quiz ? {
                                    title: l.quiz.title,
                                    weight_percentage: l.quiz.weight_percentage,
                                    percentage: l.quiz.percentage,
                                    progress: l.quiz.progress
                                } : null
                            })) || []
                        });
                    });
                }
                
                if (response.data.scoreStructure.post_test) {
                    console.log('🏁 Post-test:', {
                        title: response.data.scoreStructure.post_test.title,
                        weight_percentage: response.data.scoreStructure.post_test.weight_percentage,
                        percentage: response.data.scoreStructure.post_test.percentage,
                        progress: response.data.scoreStructure.post_test.progress
                    });
                }
                console.groupEnd();
                
                // ✅ Log ข้อมูลทันทีหลังจากได้ข้อมูลมา
                    console.group('🎯 Console Log ตามที่ User ขอ');
                    console.log('📚 1. ชื่อวิชา:', response.data.subject?.title || currentSubjectTitle);
                    console.log('💯 2. คะแนนดิบของวิชา:', {
                        currentScore: calculateCurrentScore(),
                        maxScore: calculateMaxScore(),
                        passingScore: calculatePassingScore(),
                        passingPercentage: response.data.subject?.passing_percentage || 80
                    });
                    
                    // ✅ เพิ่มการ log ข้อมูลคะแนนที่ใช้ในการคำนวณ
                    console.log('🔍 ข้อมูลคะแนนที่ใช้ในการคำนวณ:', {
                        scoreStructure: response.data.scoreStructure,
                        preTest: response.data.scoreStructure.pre_test ? {
                            title: response.data.scoreStructure.pre_test.title,
                            weight_percentage: response.data.scoreStructure.pre_test.weight_percentage,
                            percentage: response.data.scoreStructure.pre_test.percentage,
                            progress: response.data.scoreStructure.pre_test.progress
                        } : null,
                        bigLessons: response.data.scoreStructure.big_lessons?.map((bl: any) => ({
                            title: bl.title,
                            weight_percentage: bl.weight_percentage,
                            percentage: bl.percentage,
                            quiz: bl.quiz ? {
                                title: bl.quiz.title,
                                weight_percentage: bl.quiz.weight_percentage,
                                percentage: bl.quiz.percentage,
                                progress: bl.quiz.progress
                            } : null,
                            lessons: bl.lessons?.map((l: any) => ({
                                title: l.title,
                                weight_percentage: l.weight_percentage,
                                percentage: l.percentage,
                                video_completed: l.video_completed,
                                quiz: l.quiz ? {
                                    title: l.quiz.title,
                                    weight_percentage: l.quiz.weight_percentage,
                                    percentage: l.quiz.percentage,
                                    progress: l.quiz.progress
                                } : null
                            })) || []
                        })) || [],
                        postTest: response.data.scoreStructure.post_test ? {
                            title: response.data.scoreStructure.post_test.title,
                            weight_percentage: response.data.scoreStructure.post_test.weight_percentage,
                            percentage: response.data.scoreStructure.post_test.percentage,
                            progress: response.data.scoreStructure.post_test.progress
                        } : null
                    });
                console.log('📊 3. Progress และสถานะการผ่าน:', {
                    overallProgress: calculateOverallProgress(),
                    isSubjectPassed: isSubjectPassed(),
                    scorePassed: calculateCurrentScore() >= calculatePassingScore(),
                    progressPassed: calculateOverallProgress() >= 100
                });
                console.log('🏗️ 4. โครงสร้างของวิชา:', {
                        totalBigLessons: response.data.scoreStructure.big_lessons?.length || 0,
                        bigLessons: response.data.scoreStructure.big_lessons?.map((bl: any) => ({
                            id: bl.id,
                            title: bl.title,
                            totalSubLessons: bl.lessons?.length || 0,
                            hasQuiz: !!bl.quiz,
                            subLessons: bl.lessons?.map((lesson: any) => ({
                                id: lesson.id,
                                title: lesson.title,
                                hasQuiz: !!lesson.quiz
                            })) || []
                        })) || [],
                        hasPreTest: !!response.data.scoreStructure.pre_test,
                        hasPostTest: !!response.data.scoreStructure.post_test,
                        preTest: response.data.scoreStructure.pre_test ? {
                            title: response.data.scoreStructure.pre_test.title,
                            weight: response.data.scoreStructure.pre_test.weight_percentage
                        } : null,
                        postTest: response.data.scoreStructure.post_test ? {
                            title: response.data.scoreStructure.post_test.title,
                            weight: response.data.scoreStructure.post_test.weight_percentage
                        } : null
                    });
                
                // ✅ เพิ่มการ log ข้อมูล 4.1-4.8 ตามที่ User ขอ
                console.group('📋 4. สถานะการเรียนของวิชานี้');
                
                // 4.1 Pre-test
                if (response.data.scoreStructure.pre_test) {
                    console.log('🎯 4.1 แบบทดสอบก่อนเรียน:', {
                        title: response.data.scoreStructure.pre_test.title,
                        status: response.data.scoreStructure.pre_test.progress?.passed ? 'ผ่าน' : 
                               response.data.scoreStructure.pre_test.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                        canTake: !response.data.scoreStructure.pre_test.locked ? 'ได้' : 'ไม่ได้'
                    });
                } else {
                    console.log('🎯 4.1 แบบทดสอบก่อนเรียน: ไม่มีในวิชานี้');
                }
                
                // 4.2 Big Lessons
                if (response.data.scoreStructure.big_lessons && response.data.scoreStructure.big_lessons.length > 0) {
                    console.log('📖 4.2 Big Lessons:', {
                        count: response.data.scoreStructure.big_lessons.length,
                        lessons: response.data.scoreStructure.big_lessons.map((bl: any, index: number) => ({
                            index: index + 1,
                            title: bl.title,
                            subLessonsCount: bl.lessons?.length || 0,
                            hasQuiz: !!bl.quiz,
                            status: 'ดูใน modal'
                        }))
                    });
                } else {
                    console.log('📖 4.2 Big Lessons: ไม่มีในวิชานี้');
                }
                
                // 4.3 แบบทดสอบประจำ
                if (response.data.scoreStructure.big_lessons && response.data.scoreStructure.big_lessons.length > 0) {
                    const quizzes = response.data.scoreStructure.big_lessons
                        .filter((bl: any) => bl.quiz)
                        .map((bl: any) => ({
                            bigLesson: bl.title,
                            quiz: bl.quiz.title,
                            status: bl.quiz.progress?.passed ? 'ผ่าน' :
                                   bl.quiz.progress?.awaiting_review ? 'รอตรวจ' :
                                   bl.quiz.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                            canTake: (bl.lessons?.every((l: any) => l.video_completed) || false) ? 'ได้' : 'ไม่ได้'
                        }));
                    console.log('🎯 4.3 แบบทดสอบประจำ:', {
                        count: quizzes.length,
                        quizzes: quizzes
                    });
                } else {
                    console.log('🎯 4.3 แบบทดสอบประจำ: ไม่มีในวิชานี้');
                }
                
                // 4.4 บทเรียนย่อย
                if (response.data.scoreStructure.big_lessons && response.data.scoreStructure.big_lessons.length > 0) {
                    const subLessons = response.data.scoreStructure.big_lessons.flatMap((bl: any) => 
                        (bl.lessons || []).map((lesson: any) => ({
                            bigLesson: bl.title,
                            lesson: lesson.title,
                            status: lesson.video_completed ? 'เสร็จ' : 'ยังไม่เสร็จ',
                            hasQuiz: !!lesson.quiz
                        }))
                    );
                    console.log('📚 4.4 บทเรียนย่อย:', {
                        count: subLessons.length,
                        lessons: subLessons
                    });
                } else {
                    console.log('📚 4.4 บทเรียนย่อย: ไม่มีในวิชานี้');
                }
                
                // 4.5 แบบทดสอบประจำบทเรียนย่อย
                if (response.data.scoreStructure.big_lessons && response.data.scoreStructure.big_lessons.length > 0) {
                    const subQuizzes = response.data.scoreStructure.big_lessons.flatMap((bl: any) => 
                        (bl.lessons || []).filter((lesson: any) => lesson.quiz).map((lesson: any) => ({
                            bigLesson: bl.title,
                            lesson: lesson.title,
                            quiz: lesson.quiz.title,
                            status: lesson.quiz.progress?.passed ? 'ผ่าน' :
                                   lesson.quiz.progress?.awaiting_review ? 'รอตรวจ' :
                                   lesson.quiz.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                            canTake: lesson.video_completed ? 'ได้' : 'ไม่ได้'
                        }))
                    );
                    console.log('📝 4.5 แบบทดสอบประจำบทเรียนย่อย:', {
                        count: subQuizzes.length,
                        quizzes: subQuizzes
                    });
                } else {
                    console.log('📝 4.5 แบบทดสอบประจำบทเรียนย่อย: ไม่มีในวิชานี้');
                }
                
                // 4.6 โครงสร้างทั้งหมด
                console.log('🏗️ 4.6 โครงสร้างทั้งหมด: ดูใน modal');
                
                // 4.7 Post-test
                if (response.data.scoreStructure.post_test) {
                    console.log('🏁 4.7 แบบทดสอบท้ายบทเรียน:', {
                        title: response.data.scoreStructure.post_test.title,
                        status: response.data.scoreStructure.post_test.progress?.passed ? 'ผ่าน' :
                               response.data.scoreStructure.post_test.progress?.awaiting_review ? 'รอตรวจ' :
                               response.data.scoreStructure.post_test.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                        canTake: 'ดูเงื่อนไขใน modal'
                    });
                } else {
                    console.log('🏁 4.7 แบบทดสอบท้ายบทเรียน: ไม่มีในวิชานี้');
                }
                
                // 4.8 แหล่งข้อมูล
                console.log('🗄️ 4.8 แหล่งข้อมูล: subjects, big_lessons, lessons, quizzes, score_management, student_quiz_attempts, student_lesson_progress tables');
                
                console.groupEnd(); // ปิด 4. สถานะการเรียน
                console.groupEnd(); // ปิด Console Log ตามที่ User ขอ
            }
        } catch (error: any) {
            console.error('Error fetching hierarchical scores:', error);
            // ไม่แสดง error toast เพราะอาจเป็น API ที่ยังไม่ได้ implement
        }
    }, [currentSubjectId]);

    // ✅ เพิ่ม useEffect เพื่อ log เมื่อ scoreStructure เปลี่ยน
    useEffect(() => {
        if (scoreStructure && Object.keys(scoreStructure).length > 0) {
            console.group('🔄 scoreStructure State Updated');
            console.log('📊 Current scoreStructure state:', scoreStructure);
            console.log('📚 Subject title from state:', currentSubjectTitle);
            console.log('💯 Scores calculated from current state:', {
                currentScore: calculateCurrentScore(),
                maxScore: calculateMaxScore(),
                passingScore: calculatePassingScore()
            });
            console.log('🎯 hierarchicalData ที่จะส่งไป LessonFaq:', scoreStructure);
            console.groupEnd();
        }
    }, [scoreStructure, currentSubjectTitle, calculateCurrentScore, calculateMaxScore, calculatePassingScore]);

    // ✅ เพิ่มฟังก์ชัน debug สถานะการเรียน
    const displayDebugStatus = () => {
        console.group('🔍 Debug: ตรวจสอบข้อมูลปัจจุบัน');
        console.log('📊 Current scoreStructure:', scoreStructure);
        console.log('📚 Current subject title:', currentSubjectTitle);
        console.log('🔢 Current subject ID:', currentSubjectId);
        console.log('📈 Current passing percentage:', subjectPassingPercentage);
        console.log('📚 lessonData:', lessonData);
        console.log('🎯 subjectQuizzes:', subjectQuizzes);
        console.groupEnd();

        // ✅ แสดง Modal แทนการใช้ alert
        setShowDebugModal(true);
    };

    // ✅ เพิ่มฟังก์ชันสำหรับ render Debug Modal
    const renderDebugModal = () => {
        if (!showDebugModal) return null;

        return (
            <div 
                className="debug-modal-overlay" 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}
                onClick={() => setShowDebugModal(false)}
            >
                <div 
                    className="debug-modal-content"
                    style={{
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '15px',
                        padding: '25px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                        border: '2px solid #333'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px',
                        borderBottom: '2px solid #333',
                        paddingBottom: '15px'
                    }}>
                        <h2 style={{ 
                            margin: 0, 
                            fontSize: '1.5rem',
                            color: '#ff6b6b',
                            fontWeight: 'bold'
                        }}>
                            🐛 Debug Console - สถานะการเรียนของวิชานี้
                        </h2>
                        <button
                            onClick={() => setShowDebugModal(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '5px 10px',
                                borderRadius: '5px'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content Preview */}
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        
                        {/* 1. Subject Info */}
                        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>📚 1. ข้อมูลวิชา</h3>
                            <div style={{ paddingLeft: '15px' }}>
                                <p><strong>ชื่อวิชา:</strong> <span style={{ color: '#81c784' }}>{currentSubjectTitle || 'ไม่มีข้อมูล'}</span></p>
                                <p><strong>รหัสวิชา:</strong> <span style={{ color: '#81c784' }}>{currentSubjectId || 'ไม่มีข้อมูล'}</span></p>
                                <p><strong>เกณฑ์ผ่าน:</strong> <span style={{ color: '#81c784' }}>{subjectPassingPercentage}%</span></p>
                                <p><strong>แหล่งข้อมูล:</strong> <code style={{ color: '#ffb74d' }}>subjects table + scoreStructure API</code></p>
                            </div>
                        </div>

                        {/* 2. Scores */}
                        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>💯 2. คะแนนดิบของวิชา</h3>
                            <div style={{ paddingLeft: '15px' }}>
                        <p><strong>คะแนนปัจจุบัน:</strong> <span style={{ color: '#81c784' }}>{calculateCurrentScore().toFixed(2)}</span></p>
                        <p><strong>คะแนนเต็ม:</strong> <span style={{ color: '#81c784' }}>{calculateMaxScore().toFixed(2)}</span></p>
                                <p><strong>คะแนนผ่าน:</strong> <span style={{ color: '#81c784' }}>{calculatePassingScore().toFixed(2)}</span></p>
                                <p><strong>แหล่งข้อมูล:</strong> <code style={{ color: '#ffb74d' }}>calculated from scoreStructure hierarchy</code></p>
                            </div>
                        </div>

                        {/* 3. Structure */}
                        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>🏗️ 3. โครงสร้างของวิชา</h3>
                            <div style={{ paddingLeft: '15px' }}>
                                <p><strong>จำนวน Big Lessons:</strong> <span style={{ color: '#81c784' }}>{scoreStructure?.big_lessons?.length || 0}</span></p>
                                <p><strong>มีแบบทดสอบก่อนเรียน:</strong> <span style={{ color: !!scoreStructure?.pre_test ? '#81c784' : '#f48fb1' }}>{!!scoreStructure?.pre_test ? 'มี' : 'ไม่มี'}</span></p>
                                <p><strong>มีแบบทดสอบหลังเรียน:</strong> <span style={{ color: !!scoreStructure?.post_test ? '#81c784' : '#f48fb1' }}>{!!scoreStructure?.post_test ? 'มี' : 'ไม่มี'}</span></p>
                                <p><strong>แหล่งข้อมูล:</strong> <code style={{ color: '#ffb74d' }}>scoreStructure API</code></p>
                            </div>
                        </div>

                        {/* 4.1 Pre-test */}
                        {scoreStructure?.pre_test && (
                            <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                                <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>🎯 4.1 แบบทดสอบก่อนเรียน</h3>
                                <div style={{ paddingLeft: '15px' }}>
                                    <p><strong>ชื่อ:</strong> <span style={{ color: '#81c784' }}>{scoreStructure.pre_test.title}</span></p>
                                    <p><strong>สถานะ:</strong> <span style={{ 
                                        color: scoreStructure.pre_test.progress?.passed ? '#81c784' : 
                                               scoreStructure.pre_test.progress?.completed ? '#f48fb1' : '#ffb74d' 
                                    }}>
                                        {scoreStructure.pre_test.progress?.passed ? 'ผ่าน' : 
                                         scoreStructure.pre_test.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ'}
                                    </span></p>
                                    <p><strong>สามารถทำได้:</strong> <span style={{ color: '#81c784' }}>{!scoreStructure.pre_test.locked ? 'ได้' : 'ไม่ได้'}</span></p>
                                    <p><strong>แหล่งข้อมูล:</strong> <code style={{ color: '#ffb74d' }}>quizzes table + score_management</code></p>
                                </div>
                            </div>
                        )}

                        {/* 4.2 Big Lessons */}
                        {scoreStructure?.big_lessons && scoreStructure.big_lessons.length > 0 && (
                            <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                                <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>📖 4.2 Big Lessons ({scoreStructure.big_lessons.length} บท)</h3>
                                <div style={{ paddingLeft: '15px' }}>
                                {scoreStructure.big_lessons.map((bl: any, blIndex: number) => {
                                    const totalItems = (bl.lessons?.length || 0) + (bl.quiz ? 1 : 0);
                                    const completedItems = (bl.lessons?.filter((l: any) => l.video_completed)?.length || 0) + 
                                                         (bl.quiz?.progress?.passed ? 1 : 0);
                                    const status = totalItems > 0 && completedItems === totalItems ? 'ผ่าน' : 'ไม่ผ่าน';
                                    
                                    return (
                                        <div key={bl.id} style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: '3px solid #555' }}>
                                            <h4 style={{ color: '#ffb74d', marginBottom: '8px' }}>
                                                {blIndex + 1}. {bl.title} - <span style={{ color: status === 'ผ่าน' ? '#81c784' : '#f48fb1' }}>{status}</span>
                                            </h4>
                                            
                                            {/* Sub Lessons */}
                                            {bl.lessons && bl.lessons.length > 0 && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <p style={{ fontWeight: 'bold', color: '#b39ddb' }}>4.4 Sub Lessons:</p>
                                                    {bl.lessons.map((lesson: any, lIndex: number) => (
                                                        <div key={lesson.id} style={{ paddingLeft: '15px', marginBottom: '5px' }}>
                                                            <span style={{ color: '#e0e0e0' }}>
                                                                {blIndex + 1}.{lIndex + 1} {lesson.title}
                                                            </span>
                                                            <br />
                                                            <span style={{ fontSize: '0.8rem', paddingLeft: '20px' }}>
                                                                Video: <span style={{ color: lesson.video_completed ? '#81c784' : '#f48fb1' }}>
                                                                    {lesson.video_completed ? '✓ เสร็จ' : '✗ ยังไม่เสร็จ'}
                                                                </span>
                                                                {lesson.quiz && (
                                                                    <>
                                                                        , type Quiz: <span style={{ 
                                                                            color: lesson.quiz.progress?.passed ? '#81c784' :
                                                                                   lesson.quiz.progress?.awaiting_review ? '#ffb74d' :
                                                                                   lesson.quiz.progress?.completed ? '#f48fb1' : '#bdbdbd'
                                                                        }}>
                                                                            {lesson.quiz.progress?.passed ? 'ผ่าน' :
                                                                             lesson.quiz.progress?.awaiting_review ? 'รอตรวจ' :
                                                                             lesson.quiz.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ'}
                                                                        </span>
                                                                        , สามารถทำได้: <span style={{ color: lesson.video_completed ? '#81c784' : '#f48fb1' }}>
                                                                            {lesson.video_completed ? 'ได้' : 'ไม่ได้'}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Big Lesson Quiz */}
                                            {bl.quiz && (
                                                <div style={{ paddingLeft: '15px' }}>
                                                    <p style={{ fontWeight: 'bold', color: '#b39ddb' }}>4.3 แบบทดสอบประจำบทเรียน:</p>
                                                    <span style={{ color: '#e0e0e0' }}>{bl.quiz.title}</span>
                                                    <br />
                                                    <span style={{ fontSize: '0.8rem', paddingLeft: '20px' }}>
                                                        สถานะ: <span style={{ 
                                                            color: bl.quiz.progress?.passed ? '#81c784' :
                                                                   bl.quiz.progress?.awaiting_review ? '#ffb74d' :
                                                                   bl.quiz.progress?.completed ? '#f48fb1' : '#bdbdbd'
                                                        }}>
                                                            {bl.quiz.progress?.passed ? 'ผ่าน' :
                                                             bl.quiz.progress?.awaiting_review ? 'รอตรวจ' :
                                                             bl.quiz.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ'}
                                                        </span>
                                                        , สามารถทำได้: <span style={{ color: '#81c784' }}>
                                                            {(bl.lessons?.every((l: any) => l.video_completed) || false) ? 'ได้' : 'ไม่ได้'}
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px' }}>
                                                <strong>แหล่งข้อมูล:</strong> <code>big_lessons + lessons + quizzes tables</code>
                                            </p>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        )}

                        {/* 4.4 Sub Lessons Summary */}
                        {scoreStructure?.big_lessons && scoreStructure.big_lessons.length > 0 && (
                            <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                                <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>📝 4.4 สรุป Sub Lessons</h3>
                                <div style={{ paddingLeft: '15px' }}>
                                    {(() => {
                                        const totalSubLessons = scoreStructure.big_lessons.reduce((total: number, bl: any) => 
                                            total + (bl.lessons?.length || 0), 0);
                                        const completedSubLessons = scoreStructure.big_lessons.reduce((total: number, bl: any) => 
                                            total + (bl.lessons?.filter((l: any) => l.video_completed)?.length || 0), 0);
                                        const progress = totalSubLessons > 0 ? (completedSubLessons / totalSubLessons) * 100 : 0;
                                        
                                        return (
                                            <>
                                                <p><strong>จำนวน Sub Lessons ทั้งหมด:</strong> <span style={{ color: '#81c784' }}>{totalSubLessons}</span></p>
                                                <p><strong>เสร็จแล้ว:</strong> <span style={{ color: '#81c784' }}>{completedSubLessons}</span></p>
                                                <p><strong>ยังไม่เสร็จ:</strong> <span style={{ color: '#f48fb1' }}>{totalSubLessons - completedSubLessons}</span></p>
                                                <p><strong>ความคืบหน้า:</strong> <span style={{ color: progress >= 90 ? '#81c784' : '#ffb74d' }}>{progress.toFixed(1)}%</span></p>
                                            </>
                                        );
                                    })()}
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                                        <strong>แหล่งข้อมูล:</strong> <code>lessons table + student_lesson_progress</code>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 4.5 Quiz Summary */}
                        {scoreStructure?.big_lessons && scoreStructure.big_lessons.length > 0 && (
                            <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                                <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>🧩 4.5 สรุป Quiz ทั้งหมด</h3>
                                <div style={{ paddingLeft: '15px' }}>
                                    {(() => {
                                        let totalQuizzes = 0;
                                        let passedQuizzes = 0;
                                        let awaitingReview = 0;
                                        let failedQuizzes = 0;
                                        let notAttempted = 0;
                                        
                                        // Count pre-test
                                        if (scoreStructure.pre_test) {
                                            totalQuizzes++;
                                            if (scoreStructure.pre_test.progress?.passed) passedQuizzes++;
                                            else if (scoreStructure.pre_test.progress?.awaiting_review) awaitingReview++;
                                            else if (scoreStructure.pre_test.progress?.completed) failedQuizzes++;
                                            else notAttempted++;
                                        }
                                        
                                        // Count post-test
                                        if (scoreStructure.post_test) {
                                            totalQuizzes++;
                                            if (scoreStructure.post_test.progress?.passed) passedQuizzes++;
                                            else if (scoreStructure.post_test.progress?.awaiting_review) awaitingReview++;
                                            else if (scoreStructure.post_test.progress?.completed) failedQuizzes++;
                                            else notAttempted++;
                                        }
                                        
                                        // Count big lesson quizzes
                                        scoreStructure.big_lessons.forEach((bl: any) => {
                                            if (bl.quiz) {
                                                totalQuizzes++;
                                                if (bl.quiz.progress?.passed) passedQuizzes++;
                                                else if (bl.quiz.progress?.awaiting_review) awaitingReview++;
                                                else if (bl.quiz.progress?.completed) failedQuizzes++;
                                                else notAttempted++;
                                            }
                                            
                                            // Count sub lesson quizzes
                                            bl.lessons?.forEach((lesson: any) => {
                                                if (lesson.quiz) {
                                                    totalQuizzes++;
                                                    if (lesson.quiz.progress?.passed) passedQuizzes++;
                                                    else if (lesson.quiz.progress?.awaiting_review) awaitingReview++;
                                                    else if (lesson.quiz.progress?.completed) failedQuizzes++;
                                                    else notAttempted++;
                                                }
                                            });
                                        });
                                        
                                        const progress = totalQuizzes > 0 ? (passedQuizzes / totalQuizzes) * 100 : 0;
                                        
                                        return (
                                            <>
                                                <p><strong>จำนวน Quiz ทั้งหมด:</strong> <span style={{ color: '#81c784' }}>{totalQuizzes}</span></p>
                                                <p><strong>ผ่าน:</strong> <span style={{ color: '#81c784' }}>{passedQuizzes}</span></p>
                                                <p><strong>รอตรวจ:</strong> <span style={{ color: '#ffb74d' }}>{awaitingReview}</span></p>
                                                <p><strong>ไม่ผ่าน:</strong> <span style={{ color: '#f48fb1' }}>{failedQuizzes}</span></p>
                                                <p><strong>ยังไม่ทำ:</strong> <span style={{ color: '#bdbdbd' }}>{notAttempted}</span></p>
                                                <p><strong>อัตราการผ่าน:</strong> <span style={{ color: progress >= 80 ? '#81c784' : '#ffb74d' }}>{progress.toFixed(1)}%</span></p>
                                            </>
                                        );
                                    })()}
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                                        <strong>แหล่งข้อมูล:</strong> <code>quizzes table + student_quiz_attempts</code>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 4.6 Progress Requirements */}
                        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>📊 4.6 เงื่อนไขความคืบหน้า</h3>
                            <div style={{ paddingLeft: '15px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <h4 style={{ color: '#ffb74d', marginBottom: '8px' }}>🎯 Pre-test:</h4>
                                    <p>• ต้องผ่าน Pre-test ก่อนถึงจะเรียน Big Lessons ได้</p>
                                    <p>• สถานะปัจจุบัน: <span style={{ 
                                        color: scoreStructure?.pre_test?.progress?.passed ? '#81c784' : 
                                               scoreStructure?.pre_test?.progress?.completed ? '#f48fb1' : '#ffb74d' 
                                    }}>
                                        {scoreStructure?.pre_test?.progress?.passed ? '✅ ผ่าน' : 
                                         scoreStructure?.pre_test?.progress?.completed ? '❌ ไม่ผ่าน' : '⏳ ยังไม่ทำ'}
                                    </span></p>
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <h4 style={{ color: '#ffb74d', marginBottom: '8px' }}>📖 Big Lessons:</h4>
                                    <p>• ต้องเรียน Sub Lessons ให้ครบก่อนถึงจะทำ Big Lesson Quiz ได้</p>
                                    <p>• ต้องผ่าน Big Lesson Quiz ก่อนถึงจะเรียน Big Lesson ถัดไปได้</p>
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <h4 style={{ color: '#ffb74d', marginBottom: '8px' }}>🏁 Post-test:</h4>
                                    <p>• ต้องผ่าน Pre-test และเรียน Sub Lessons ครบ 90% ขึ้นไป</p>
                                    <p>• สถานะปัจจุบัน: <span style={{ 
                                        color: scoreStructure?.post_test?.progress?.passed ? '#81c784' :
                                               scoreStructure?.post_test?.progress?.awaiting_review ? '#ffb74d' :
                                               scoreStructure?.post_test?.progress?.completed ? '#f48fb1' : '#bdbdbd'
                                    }}>
                                        {scoreStructure?.post_test?.progress?.passed ? '✅ ผ่าน' :
                                         scoreStructure?.post_test?.progress?.awaiting_review ? '⏳ รอตรวจ' :
                                         scoreStructure?.post_test?.progress?.completed ? '❌ ไม่ผ่าน' : '⏳ ยังไม่ทำ'}
                                    </span></p>
                                </div>
                                
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                                    <strong>แหล่งข้อมูล:</strong> <code>score_management + progress calculation logic</code>
                                </p>
                            </div>
                        </div>

                        {/* 4.7 Post-test */}
                        {scoreStructure?.post_test && (
                            <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                                <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>🏁 4.7 แบบทดสอบท้ายบทเรียน</h3>
                                <div style={{ paddingLeft: '15px' }}>
                                    <p><strong>ชื่อ:</strong> <span style={{ color: '#81c784' }}>{scoreStructure.post_test.title}</span></p>
                                    <p><strong>สถานะ:</strong> <span style={{ 
                                        color: scoreStructure.post_test.progress?.passed ? '#81c784' :
                                               scoreStructure.post_test.progress?.awaiting_review ? '#ffb74d' :
                                               scoreStructure.post_test.progress?.completed ? '#f48fb1' : '#bdbdbd'
                                    }}>
                                        {scoreStructure.post_test.progress?.passed ? 'ผ่าน' :
                                         scoreStructure.post_test.progress?.awaiting_review ? 'รอตรวจ' :
                                         scoreStructure.post_test.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ'}
                                    </span></p>
                                    
                                    {/* Requirements */}
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ fontWeight: 'bold', color: '#b39ddb' }}>เงื่อนไขการปลดล็อค:</p>
                                        <div style={{ paddingLeft: '15px' }}>
                                            {(() => {
                                                const preTestPassed = scoreStructure?.pre_test?.progress?.passed || false;
                                                const totalLessons = scoreStructure?.big_lessons?.reduce((total: number, bl: any) => 
                                                    total + (bl.lessons?.length || 0), 0) || 0;
                                                const completedLessons = scoreStructure?.big_lessons?.reduce((total: number, bl: any) => 
                                                    total + (bl.lessons?.filter((l: any) => l.video_completed)?.length || 0), 0) || 0;
                                                const lessonsProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
                                                const canTake = preTestPassed && lessonsProgress >= 90;
                                                
                                                return (
                                                    <>
                                                        <p>Pre-test ผ่าน: <span style={{ color: preTestPassed ? '#81c784' : '#f48fb1' }}>
                                                            {preTestPassed ? '✓ ผ่าน' : '✗ ยังไม่ผ่าน'}
                                                        </span></p>
                                                        <p>ความคืบหน้าบทเรียน: <span style={{ color: lessonsProgress >= 90 ? '#81c784' : '#f48fb1' }}>
                                                            {lessonsProgress.toFixed(1)}% ({completedLessons}/{totalLessons})
                                                        </span></p>
                                                        <p><strong>สามารถทำได้:</strong> <span style={{ color: canTake ? '#81c784' : '#f48fb1' }}>
                                                            {canTake ? 'ได้' : 'ไม่ได้'}
                                                        </span></p>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '15px' }}>
                                        <strong>แหล่งข้อมูล:</strong> <code>quizzes table + score_management + progress calculation</code>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 4.8 Data Sources */}
                        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>🗄️ 4.8 แหล่งข้อมูลจาก Database Tables</h3>
                            <div style={{ paddingLeft: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
                                <div><code style={{ color: '#ffb74d' }}>subjects</code> - ข้อมูลวิชา</div>
                                <div><code style={{ color: '#ffb74d' }}>big_lessons</code> - บทเรียนใหญ่</div>
                                <div><code style={{ color: '#ffb74d' }}>lessons</code> - บทเรียนย่อย</div>
                                <div><code style={{ color: '#ffb74d' }}>quizzes</code> - แบบทดสอบ</div>
                                <div><code style={{ color: '#ffb74d' }}>score_management</code> - การจัดการคะแนน</div>
                                <div><code style={{ color: '#ffb74d' }}>student_quiz_attempts</code> - ประวัติทำแบบทดสอบ</div>
                                <div><code style={{ color: '#ffb74d' }}>student_lesson_progress</code> - ความก้าวหน้าบทเรียน</div>
                            </div>
                        </div>

                        {/* 4.9 โครงสร้างของวิชานี้ */}
                        <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4fc3f7', marginBottom: '10px' }}>📋 4.9 โครงสร้างของวิชานี้</h3>
                            <div style={{ paddingLeft: '15px', fontSize: '0.8rem', maxHeight: '400px', overflowY: 'auto' }}>
                                
                                {/* ชื่อวิชา */}
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ margin: '4px 0', color: '#ffb74d', fontWeight: 'bold', fontSize: '1rem' }}>
                                        📚 {currentSubjectTitle || 'ไม่มีข้อมูล'}
                                    </p>
                                </div>

                                {/* ข้อสอบก่อนเรียน */}
                                {scoreStructure?.pre_test && (
                                    <div style={{ marginBottom: '10px', marginLeft: '15px' }}>
                                        <p style={{ margin: '4px 0', color: '#81c784' }}>
                                            🎯 ข้อสอบก่อนเรียน: {scoreStructure.pre_test.title}
                                            <span style={{ color: '#ffb74d', marginLeft: '10px' }}>
                                                ({scoreStructure.pre_test.weight_percentage || 0} คะแนน)
                                            </span>
                                            <span style={{ 
                                                color: scoreStructure.pre_test.progress?.passed ? '#81c784' : 
                                                       scoreStructure.pre_test.progress?.completed ? '#f48fb1' : '#ffb74d',
                                                marginLeft: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                [{scoreStructure.pre_test.progress?.passed ? '✅ ผ่าน' : 
                                                  scoreStructure.pre_test.progress?.completed ? '❌ ไม่ผ่าน' : '⏳ ยังไม่ทำ'}]
                                            </span>
                                        </p>
                                        {/* Debug: ตรวจสอบข้อมูลคะแนน */}
                                        <div style={{ marginLeft: '20px', fontSize: '0.7rem', color: '#888' }}>
                                            <p>🔍 Debug: progress = {JSON.stringify(scoreStructure.pre_test.progress)}</p>
                                            <p>🔍 Debug: weight_percentage = {scoreStructure.pre_test.weight_percentage || 'ไม่มีข้อมูล'}</p>
                            </div>
                        </div>
                                )}

                                {/* บทเรียนใหญ่ */}
                                {scoreStructure?.big_lessons && scoreStructure.big_lessons.map((bl: any, blIndex: number) => (
                                    <div key={bl.id} style={{ marginBottom: '10px', marginLeft: '15px' }}>
                                        <p style={{ margin: '4px 0', color: '#4fc3f7', fontWeight: 'bold' }}>
                                            📖 บทเรียนใหญ่ {blIndex + 1}: {bl.title}
                                        </p>
                                        
                                        {/* บทเรียนย่อย */}
                                        {bl.lessons && bl.lessons.map((lesson: any, lIndex: number) => (
                                            <div key={lesson.id} style={{ marginLeft: '20px', marginBottom: '6px' }}>
                                                <p style={{ margin: '2px 0', color: '#e0e0e0' }}>
                                                    📹 บทเรียนย่อย {blIndex + 1}.{lIndex + 1}: {lesson.title}
                                                    <span style={{ color: '#ffb74d', marginLeft: '10px' }}>
                                                        ({lesson.weight_percentage || 0} คะแนน)
                                                    </span>
                                                    <span style={{ 
                                                        color: lesson.video_completed ? '#81c784' : '#ffb74d',
                                                        marginLeft: '10px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        [{lesson.video_completed ? '✅ ดูแล้ว' : '⏳ ยังไม่ดู'}]
                                                    </span>
                                                </p>
                                                
                                                {/* แบบทดสอบย่อย */}
                                                {lesson.quiz && (
                                                    <div style={{ marginLeft: '15px' }}>
                                                        <p style={{ margin: '2px 0', color: '#b39ddb' }}>
                                                            📝 แบบทดสอบย่อย {blIndex + 1}.{lIndex + 1}: {lesson.quiz.title}
                                                            <span style={{ color: '#ffb74d', marginLeft: '10px' }}>
                                                                ({lesson.quiz.weight_percentage || 0} คะแนน)
                                                            </span>
                                                            <span style={{ 
                                                                color: lesson.quiz.progress?.passed ? '#81c784' :
                                                                       lesson.quiz.progress?.awaiting_review ? '#ffb74d' :
                                                                       lesson.quiz.progress?.completed ? '#f48fb1' : '#ffb74d',
                                                                marginLeft: '10px',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                [{lesson.quiz.progress?.passed ? '✅ ผ่าน' :
                                                                  lesson.quiz.progress?.awaiting_review ? '⏳ รอตรวจ' :
                                                                  lesson.quiz.progress?.completed ? '❌ ไม่ผ่าน' : '⏳ ยังไม่ทำ'}]
                                                            </span>
                                                        </p>
                                                        {/* Debug: ตรวจสอบข้อมูลคะแนน */}
                                                        <div style={{ marginLeft: '10px', fontSize: '0.7rem', color: '#888' }}>
                                                            <p>🔍 Debug: quiz progress = {JSON.stringify(lesson.quiz.progress)}</p>
                                                            <p>🔍 Debug: weight_percentage = {lesson.quiz.weight_percentage || 'ไม่มีข้อมูล'}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        
                                        {/* แบบทดสอบท้ายบทใหญ่ */}
                                        {bl.quiz && (
                                            <div style={{ marginLeft: '20px', marginBottom: '6px' }}>
                                                <p style={{ margin: '2px 0', color: '#f48fb1' }}>
                                                    🎯 แบบทดสอบท้ายบทใหญ่ {blIndex + 1}: {bl.quiz.title}
                                                    <span style={{ color: '#ffb74d', marginLeft: '10px' }}>
                                                        ({bl.quiz.weight_percentage || 0} คะแนน)
                                                    </span>
                                                    <span style={{ 
                                                        color: bl.quiz.progress?.passed ? '#81c784' :
                                                               bl.quiz.progress?.awaiting_review ? '#ffb74d' :
                                                               bl.quiz.progress?.completed ? '#f48fb1' : '#ffb74d',
                                                        marginLeft: '10px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        [{bl.quiz.progress?.passed ? '✅ ผ่าน' :
                                                          bl.quiz.progress?.awaiting_review ? '⏳ รอตรวจ' :
                                                          bl.quiz.progress?.completed ? '❌ ไม่ผ่าน' : '⏳ ยังไม่ทำ'}]
                                                    </span>
                                                </p>
                                                {/* Debug: ตรวจสอบข้อมูลคะแนน */}
                                                <div style={{ marginLeft: '10px', fontSize: '0.7rem', color: '#888' }}>
                                                    <p>🔍 Debug: big lesson quiz progress = {JSON.stringify(bl.quiz.progress)}</p>
                                                    <p>🔍 Debug: weight_percentage = {bl.quiz.weight_percentage || 'ไม่มีข้อมูล'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* แบบทดสอบท้ายบทเรียน */}
                                {scoreStructure?.post_test && (
                                    <div style={{ marginBottom: '10px', marginLeft: '15px' }}>
                                        <p style={{ margin: '4px 0', color: '#ff6b6b', fontWeight: 'bold' }}>
                                            🏁 แบบทดสอบท้ายบทเรียน: {scoreStructure.post_test.title}
                                            <span style={{ color: '#ffb74d', marginLeft: '10px' }}>
                                                ({scoreStructure.post_test.weight_percentage || 0} คะแนน)
                                            </span>
                                            <span style={{ 
                                                color: scoreStructure.post_test.progress?.passed ? '#81c784' :
                                                       scoreStructure.post_test.progress?.awaiting_review ? '#ffb74d' :
                                                       scoreStructure.post_test.progress?.completed ? '#f48fb1' : '#ffb74d',
                                                marginLeft: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                [{scoreStructure.post_test.progress?.passed ? '✅ ผ่าน' :
                                                  scoreStructure.post_test.progress?.awaiting_review ? '⏳ รอตรวจ' :
                                                  scoreStructure.post_test.progress?.completed ? '❌ ไม่ผ่าน' : '⏳ ยังไม่ทำ'}]
                                            </span>
                                        </p>
                                        {/* Debug: ตรวจสอบข้อมูลคะแนน */}
                                        <div style={{ marginLeft: '20px', fontSize: '0.7rem', color: '#888' }}>
                                            <p>🔍 Debug: post-test progress = {JSON.stringify(scoreStructure.post_test.progress)}</p>
                                            <p>🔍 Debug: weight_percentage = {scoreStructure.post_test.weight_percentage || 'ไม่มีข้อมูล'}</p>
                                        </div>
                                    </div>
                                )}

                                {/* สรุปคะแนนรวม */}
                                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#333', borderRadius: '6px' }}>
                                    <p style={{ margin: '4px 0', color: '#ffb74d', fontWeight: 'bold', fontSize: '1rem' }}>
                                        💯 สรุปคะแนนรวม: {calculateCurrentScore().toFixed(2)} / {calculateMaxScore().toFixed(2)} คะแนน
                                    </p>
                                    {/* Debug: ตรวจสอบการคำนวณคะแนน */}
                                    <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#888' }}>
                                        <p>🔍 Debug: calculateCurrentScore() = {calculateCurrentScore().toFixed(2)}</p>
                                        <p>🔍 Debug: calculateMaxScore() = {calculateMaxScore().toFixed(2)}</p>
                                        <p>🔍 Debug: scoreStructure object keys = {Object.keys(scoreStructure || {}).join(', ')}</p>
                                    </div>
                                </div>

                                {/* ข้อมูลฐานข้อมูลที่ใช้ */}
                                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1a3a1a', borderRadius: '6px', border: '1px solid #4caf50' }}>
                                    <p style={{ margin: '4px 0', color: '#81c784', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        🗄️ ข้อมูลฐานข้อมูลที่ใช้ในการคำนวณคะแนน:
                                    </p>
                                    <div style={{ marginLeft: '10px', fontSize: '0.7rem', color: '#a5d6a7' }}>
                                        <p>• <code>quiz_attempts</code> - เก็บคะแนนที่ได้จากแบบทดสอบ (score, max_score, passed)</p>
                                        <p>• <code>quiz_progress</code> - เก็บสถานะความก้าวหน้า (completed, passed, awaiting_review)</p>
                                        <p>• <code>lesson_progress</code> - เก็บสถานะการดูวิดีโอ (video_completed, completed)</p>
                                        <p>• <code>video_progress</code> - เก็บความคืบหน้าการดูวิดีโอ (watched_seconds, video_duration)</p>
                                        <p>• <code>score_change_logs</code> - เก็บประวัติการเปลี่ยนแปลงคะแนน</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: '20px',
                        paddingTop: '15px',
                        borderTop: '2px solid #333'
                    }}>
                        <button
                            onClick={() => setShowDebugModal(false)}
                            style={{
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff5252'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
                        >
                            ปิด Debug Console
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ✅ Task 5: ลบ paymentStatus state
    // const [paymentStatus, setPaymentStatus] = useState<any>(null);

    // ✅ เพิ่ม ref เพื่อเก็บค่า accordion state ที่ต้องการรักษาไว้
    const intendedAccordionState = useRef<number | null>(null);

    // ฟังก์ชันสกัด YouTube ID จาก URL (ใช้ useCallback เพื่อป้องกัน re-creation)
    const extractYoutubeId = useCallback((url?: string): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    }, []);

    // โหลดข้อมูลหลักสูตรทั้งหมดเมื่อโหลดหน้า (ใช้ useCallback เพื่อป้องกัน re-creation)
    const fetchCourseData = useCallback(async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/learn/course/${courseId}/full-content`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success && response.data.course) {
                setCourseData(response.data.course);
                const sections: SectionData[] = [];
                const subject = response.data.course.subjects.find(
                    (s: any) => s.subject_id === subjectId
                );

                if (!subject) {
                    console.error(
                        `ไม่พบรายวิชารหัส ${subjectId} ในหลักสูตรรหัส ${courseId}`
                    );
                    setLoading(false);
                    return;
                }

                setCurrentSubjectTitle(subject.title);
                setCurrentSubjectId(subject.subject_id);
                
                // ✅ เรียก fetchScoreItems ทันทีหลังจากตั้งค่า currentSubjectId
                console.log('🎯 Setting currentSubjectId to:', subject.subject_id);
                console.log('🎯 Will call fetchScoreItems with subjectId:', subject.subject_id);

                // ✅ เรียก fetchScoreItems โดยตรงด้วย subjectId ที่เพิ่งได้
                try {
                    const token = localStorage.getItem("token");
                    if (token) {
                        console.log('🚀 Calling fetchScoreItems directly with subjectId:', subject.subject_id);
                        const scoreResponse = await axios.get(
                            `${API_URL}/api/learn/subject/${subject.subject_id}/scores-hierarchical`,
                            {
                                headers: { Authorization: `Bearer ${token}` }
                            }
                        );

                        if (scoreResponse.data.success && scoreResponse.data.scoreStructure) {
                            setScoreStructure(scoreResponse.data.scoreStructure);
                            setSubjectPassingPercentage(Number(scoreResponse.data.subject?.passing_percentage) || 80);
                            
                            console.log('✅ Direct fetchScoreItems success:', scoreResponse.data.scoreStructure);
                            
                            // ✅ Log ข้อมูลทันทีหลังจาก setScoreStructure
                                console.group('🎯 Console Log ตามที่ User ขอ (from fetchCourseData)');
                                console.log('📚 1. ชื่อวิชา:', scoreResponse.data.subject?.title || subject.title);
                                console.log('💯 2. คะแนนดิบของวิชา:', {
                                    currentScore: calculateCurrentScore(),
                                    maxScore: calculateMaxScore(),
                                    passingScore: calculatePassingScore()
                                });
                                
                                // ✅ เพิ่มการ log ข้อมูลคะแนนที่ใช้ในการคำนวณ
                                console.log('🔍 ข้อมูลคะแนนที่ใช้ในการคำนวณ:', {
                                    scoreStructure: scoreResponse.data.scoreStructure,
                                    preTest: scoreResponse.data.scoreStructure.pre_test ? {
                                        title: scoreResponse.data.scoreStructure.pre_test.title,
                                        weight_percentage: scoreResponse.data.scoreStructure.pre_test.weight_percentage,
                                        percentage: scoreResponse.data.scoreStructure.pre_test.percentage,
                                        progress: scoreResponse.data.scoreStructure.pre_test.progress
                                    } : null,
                                    bigLessons: scoreResponse.data.scoreStructure.big_lessons?.map((bl: any) => ({
                                        title: bl.title,
                                        weight_percentage: bl.weight_percentage,
                                        percentage: bl.percentage,
                                        quiz: bl.quiz ? {
                                            title: bl.quiz.title,
                                            weight_percentage: bl.quiz.weight_percentage,
                                            percentage: bl.quiz.percentage,
                                            progress: bl.quiz.progress
                                        } : null,
                                        lessons: bl.lessons?.map((l: any) => ({
                                            title: l.title,
                                            weight_percentage: l.weight_percentage,
                                            percentage: l.percentage,
                                            video_completed: l.video_completed,
                                            quiz: l.quiz ? {
                                                title: l.quiz.title,
                                                weight_percentage: l.quiz.weight_percentage,
                                                percentage: l.quiz.percentage,
                                                progress: l.quiz.progress
                                            } : null
                                        })) || []
                                    })) || [],
                                    postTest: scoreResponse.data.scoreStructure.post_test ? {
                                        title: scoreResponse.data.scoreStructure.post_test.title,
                                        weight_percentage: scoreResponse.data.scoreStructure.post_test.weight_percentage,
                                        percentage: scoreResponse.data.scoreStructure.post_test.percentage,
                                        progress: scoreResponse.data.scoreStructure.post_test.progress
                                    } : null
                                });
                                console.log('🏗️ 3. โครงสร้างของวิชา:', {
                                    totalBigLessons: scoreResponse.data.scoreStructure.big_lessons?.length || 0,
                                    bigLessons: scoreResponse.data.scoreStructure.big_lessons?.map((bl: any) => ({
                                        id: bl.id,
                                        title: bl.title,
                                        totalSubLessons: bl.lessons?.length || 0,
                                        hasQuiz: !!bl.quiz,
                                        subLessons: bl.lessons?.map((lesson: any) => ({
                                            id: lesson.id,
                                            title: lesson.title,
                                            hasQuiz: !!lesson.quiz
                                        })) || []
                                    })) || [],
                                    hasPreTest: !!scoreResponse.data.scoreStructure.pre_test,
                                    hasPostTest: !!scoreResponse.data.scoreStructure.post_test,
                                    preTest: scoreResponse.data.scoreStructure.pre_test ? {
                                        title: scoreResponse.data.scoreStructure.pre_test.title,
                                        weight: scoreResponse.data.scoreStructure.pre_test.weight_percentage
                                    } : null,
                                    postTest: scoreResponse.data.scoreStructure.post_test ? {
                                        title: scoreResponse.data.scoreStructure.post_test.title,
                                        weight: scoreResponse.data.scoreStructure.post_test.weight_percentage
                                    } : null
                                });
                            
                            // ✅ เพิ่มการ log ข้อมูล 4.1-4.8 ตามที่ User ขอ
                            console.group('📋 4. สถานะการเรียนของวิชานี้ (from fetchCourseData)');
                            
                            // 4.1 Pre-test
                            if (scoreResponse.data.scoreStructure.pre_test) {
                                console.log('🎯 4.1 แบบทดสอบก่อนเรียน:', {
                                    title: scoreResponse.data.scoreStructure.pre_test.title,
                                    status: scoreResponse.data.scoreStructure.pre_test.progress?.passed ? 'ผ่าน' : 
                                           scoreResponse.data.scoreStructure.pre_test.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                                    canTake: !scoreResponse.data.scoreStructure.pre_test.locked ? 'ได้' : 'ไม่ได้'
                                });
                            } else {
                                console.log('🎯 4.1 แบบทดสอบก่อนเรียน: ไม่มีในวิชานี้');
                            }
                            
                            // 4.2 Big Lessons
                            if (scoreResponse.data.scoreStructure.big_lessons && scoreResponse.data.scoreStructure.big_lessons.length > 0) {
                                console.log('📖 4.2 Big Lessons:', {
                                    count: scoreResponse.data.scoreStructure.big_lessons.length,
                                    lessons: scoreResponse.data.scoreStructure.big_lessons.map((bl: any, index: number) => ({
                                        index: index + 1,
                                        title: bl.title,
                                        subLessonsCount: bl.lessons?.length || 0,
                                        hasQuiz: !!bl.quiz,
                                        status: 'ดูใน modal'
                                    }))
                                });
                            } else {
                                console.log('📖 4.2 Big Lessons: ไม่มีในวิชานี้');
                            }
                            
                            // 4.3 แบบทดสอบประจำ
                            if (scoreResponse.data.scoreStructure.big_lessons && scoreResponse.data.scoreStructure.big_lessons.length > 0) {
                                const quizzes = scoreResponse.data.scoreStructure.big_lessons
                                    .filter((bl: any) => bl.quiz)
                                    .map((bl: any) => ({
                                        bigLesson: bl.title,
                                        quiz: bl.quiz.title,
                                        status: bl.quiz.progress?.passed ? 'ผ่าน' :
                                               bl.quiz.progress?.awaiting_review ? 'รอตรวจ' :
                                               bl.quiz.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                                        canTake: (bl.lessons?.every((l: any) => l.video_completed) || false) ? 'ได้' : 'ไม่ได้'
                                    }));
                                console.log('🎯 4.3 แบบทดสอบประจำ:', {
                                    count: quizzes.length,
                                    quizzes: quizzes
                                });
                            } else {
                                console.log('🎯 4.3 แบบทดสอบประจำ: ไม่มีในวิชานี้');
                            }
                            
                            // 4.4 บทเรียนย่อย
                            if (scoreResponse.data.scoreStructure.big_lessons && scoreResponse.data.scoreStructure.big_lessons.length > 0) {
                                const subLessons = scoreResponse.data.scoreStructure.big_lessons.flatMap((bl: any) => 
                                    (bl.lessons || []).map((lesson: any) => ({
                                        bigLesson: bl.title,
                                        lesson: lesson.title,
                                        status: lesson.video_completed ? 'เสร็จ' : 'ยังไม่เสร็จ',
                                        hasQuiz: !!lesson.quiz
                                    }))
                                );
                                console.log('📚 4.4 บทเรียนย่อย:', {
                                    count: subLessons.length,
                                    lessons: subLessons
                                });
                            } else {
                                console.log('📚 4.4 บทเรียนย่อย: ไม่มีในวิชานี้');
                            }
                            
                            // 4.5 แบบทดสอบประจำบทเรียนย่อย
                            if (scoreResponse.data.scoreStructure.big_lessons && scoreResponse.data.scoreStructure.big_lessons.length > 0) {
                                const subQuizzes = scoreResponse.data.scoreStructure.big_lessons.flatMap((bl: any) => 
                                    (bl.lessons || []).filter((lesson: any) => lesson.quiz).map((lesson: any) => ({
                                        bigLesson: bl.title,
                                        lesson: lesson.title,
                                        quiz: lesson.quiz.title,
                                        status: lesson.quiz.progress?.passed ? 'ผ่าน' :
                                               lesson.quiz.progress?.awaiting_review ? 'รอตรวจ' :
                                               lesson.quiz.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                                        canTake: lesson.video_completed ? 'ได้' : 'ไม่ได้'
                                    }))
                                );
                                console.log('📝 4.5 แบบทดสอบประจำบทเรียนย่อย:', {
                                    count: subQuizzes.length,
                                    quizzes: subQuizzes
                                });
                            } else {
                                console.log('📝 4.5 แบบทดสอบประจำบทเรียนย่อย: ไม่มีในวิชานี้');
                            }
                            
                            // 4.6 โครงสร้างทั้งหมด
                            console.log('🏗️ 4.6 โครงสร้างทั้งหมด: ดูใน modal');
                            
                            // 4.7 Post-test
                            if (scoreResponse.data.scoreStructure.post_test) {
                                console.log('🏁 4.7 แบบทดสอบท้ายบทเรียน:', {
                                    title: scoreResponse.data.scoreStructure.post_test.title,
                                    status: scoreResponse.data.scoreStructure.post_test.progress?.passed ? 'ผ่าน' :
                                           scoreResponse.data.scoreStructure.post_test.progress?.awaiting_review ? 'รอตรวจ' :
                                           scoreResponse.data.scoreStructure.post_test.progress?.completed ? 'ไม่ผ่าน' : 'ยังไม่ทำ',
                                    canTake: 'ดูเงื่อนไขใน modal'
                                });
                            } else {
                                console.log('🏁 4.7 แบบทดสอบท้ายบทเรียน: ไม่มีในวิชานี้');
                            }
                            
                            // 4.8 แหล่งข้อมูล
                            console.log('🗄️ 4.8 แหล่งข้อมูล: subjects, big_lessons, lessons, quizzes, score_management, student_quiz_attempts, student_lesson_progress tables');
                            
                            console.groupEnd(); // ปิด 4. สถานะการเรียน
                            console.groupEnd(); // ปิด Console Log ตามที่ User ขอ
                        }
                    }
                } catch (scoreError) {
                    console.error('❌ Direct fetchScoreItems error:', scoreError);
                }

                if (subject.lessons && subject.lessons.length > 0) {
                    subject.lessons.forEach((lesson: any, lessonIndex: number) => {
                        // ตรวจสอบว่าเป็น Big Lesson หรือไม่
                        if (lesson.is_big_lesson) {
                            // Big Lesson - แสดง Sub Lessons
                            const sectionItems: LessonItem[] = [];
                            
                            // เพิ่ม Sub Lessons
                            if (lesson.sub_lessons && lesson.sub_lessons.length > 0) {
                                lesson.sub_lessons.forEach((subLesson: any, subIndex: number) => {
                                    // หาข้อมูลจาก hierarchical structure
                                    const hierarchicalLesson = scoreStructure?.big_lessons?.find((bl: any) => 
                                        bl.lessons?.some((l: any) => l.id === subLesson.lesson_id)
                                    )?.lessons?.find((l: any) => l.id === subLesson.lesson_id);
                                    
                                    const videoCompleted = hierarchicalLesson?.video_completed === true;
                                    
                                    // เพิ่มวิดีโอ Sub Lesson
                                    sectionItems.push({
                                        id: subIndex * 2,
                                        lesson_id: subLesson.lesson_id,
                                        title: `${lessonIndex + 1}.${subIndex + 1} 📹 ${subLesson.title}`,
                                        lock: false,
                                        completed: videoCompleted || false,
                                        type: "video",
                                        quizType: "none",
                                        duration: videoCompleted ? "100%" : "0%",
                                        video_url: subLesson.video_url,
                                        quiz_id: subLesson.quiz ? subLesson.quiz.quiz_id : undefined,
                                        status: videoCompleted ? "passed" : "failed",
                                    });

                                    // เพิ่มแบบทดสอบ Sub Lesson (ถ้ามี)
                                    if (subLesson.quiz) {
                                        let quizStatus: "passed" | "failed" | "awaiting_review" = "failed";
                                        let isCompleted = false;
                                        
                                        if (subLesson.quiz.progress?.passed) {
                                            quizStatus = "passed";
                                            isCompleted = true;
                                        } else if (subLesson.quiz.progress?.awaiting_review) {
                                            quizStatus = "awaiting_review";
                                            isCompleted = true; // ✅ awaiting_review ถือว่าเสร็จแล้ว
                                        } else if (subLesson.quiz.progress?.completed && !subLesson.quiz.progress?.passed) {
                                            quizStatus = "failed";
                                            isCompleted = true; // ✅ completed แม้จะไม่ผ่านก็ถือว่าเสร็จแล้ว
                                        }
                                        
                                        sectionItems.push({
                                            id: subIndex * 2 + 1,
                                            lesson_id: subLesson.lesson_id,
                                            title: `${lessonIndex + 1}.${subIndex + 1}.2 แบบทดสอบท้ายบท`,
                                            lock: !subLesson.progress?.video_completed,
                                            completed: isCompleted, // ✅ ใช้ isCompleted แทนการคำนวณซับซ้อน
                                            type: "quiz",
                                            quizType: subLesson.quiz.type,
                                            duration: subLesson.quiz.progress?.passed
                                                ? "100%"
                                                : subLesson.quiz.progress?.awaiting_review
                                                ? "50%"
                                                : "0%",
                                            quiz_id: subLesson.quiz.quiz_id,
                                            status: quizStatus,
                                        });
                                    }
                                });
                            }

                            // เพิ่ม Big Lesson Quiz (ถ้ามี)
                            if (lesson.quiz) {
                                let quizStatus: "passed" | "failed" | "awaiting_review" = "failed";
                                let isCompleted = false;
                                
                                if (lesson.quiz.progress?.passed) {
                                    quizStatus = "passed";
                                    isCompleted = true;
                                } else if (lesson.quiz.progress?.awaiting_review) {
                                    quizStatus = "awaiting_review";
                                    isCompleted = true; // ✅ awaiting_review ถือว่าเสร็จแล้ว
                                } else if (lesson.quiz.progress?.completed && !lesson.quiz.progress?.passed) {
                                    quizStatus = "failed";
                                    isCompleted = true; // ✅ completed แม้จะไม่ผ่านก็ถือว่าเสร็จแล้ว
                                }
                                
                                sectionItems.push({
                                    id: sectionItems.length,
                                    lesson_id: lesson.lesson_id,
                                    title: `${lessonIndex + 1}.X แบบทดสอบท้ายบทใหญ่`,
                                    lock: !sectionItems.every(item => item.completed), // ล็อคถ้ายังมี item ที่ไม่เสร็จ
                                    completed: isCompleted, // ✅ ใช้ isCompleted แทนการคำนวณซับซ้อน
                                    type: "quiz",
                                    quizType: lesson.quiz.type,
                                    duration: lesson.quiz.progress?.passed
                                        ? "100%"
                                        : lesson.quiz.progress?.awaiting_review
                                        ? "50%"
                                        : "0%",
                                    quiz_id: lesson.quiz.quiz_id,
                                    status: quizStatus,
                                });
                            }

                            let count = "";
                            if (lesson.quiz?.progress?.awaiting_review) {
                                count = "รอตรวจ";
                            } else {
                                // ใช้ข้อมูลจาก hierarchical structure
                                const videoCompleted = lesson.video_completed === true;
                                const quizPassed = lesson.quiz?.progress?.passed === true;
                                const allCompleted = videoCompleted && (!lesson.quiz || quizPassed);
                                count = allCompleted ? "ผ่าน" : "ไม่ผ่าน";
                            }

                            sections.push({
                                id: lesson.lesson_id,
                                subject_id: currentSubjectId || subject.subject_id,
                                title: `บทที่ ${lessonIndex + 1}: ${lesson.title}`,
                                count: count,
                                items: sectionItems,
                                quiz_id: lesson.quiz ? lesson.quiz.quiz_id : undefined,
                            });
                        } else {
                            // ระบบเดิม - Lesson ปกติ
                            const sectionItems: LessonItem[] = [];
                            sectionItems.push({
                                id: 0,
                                lesson_id: lesson.lesson_id,
                                title: `${lessonIndex + 1}.1 📹 ${lesson.title}`,
                                lock: false,
                                completed: lesson.progress?.video_completed || false,
                                type: "video",
                                quizType: "none",
                                duration: lesson.progress?.video_completed ? "100%" : "0%",
                                video_url: lesson.video_url,
                                quiz_id: lesson.quiz ? lesson.quiz.quiz_id : undefined,
                                status: lesson.progress?.video_completed ? "passed" : "failed",
                            });

                            if (lesson.quiz) {
                                let quizStatus: "passed" | "failed" | "awaiting_review" = "failed";
                                let isCompleted = false;
                                
                                if (lesson.quiz.progress?.passed) {
                                    quizStatus = "passed";
                                    isCompleted = true;
                                } else if (lesson.quiz.progress?.awaiting_review) {
                                    quizStatus = "awaiting_review";
                                    isCompleted = true; // ✅ awaiting_review ถือว่าเสร็จแล้ว
                                } else if (lesson.quiz.progress?.completed && !lesson.quiz.progress?.passed) {
                                    quizStatus = "failed";
                                    isCompleted = true; // ✅ completed แม้จะไม่ผ่านก็ถือว่าเสร็จแล้ว
                                }
                                
                                sectionItems.push({
                                    id: 1,
                                    lesson_id: lesson.lesson_id,
                                    title: `${lessonIndex + 1}.2 แบบทดสอบท้ายบท`,
                                    lock: !lesson.progress?.video_completed,
                                    completed: isCompleted, // ✅ ใช้ isCompleted แทนการคำนวณซับซ้อน
                                    type: "quiz",
                                    quizType: lesson.quiz.type,
                                    duration: lesson.quiz.progress?.passed
                                        ? "100%"
                                        : lesson.quiz.progress?.awaiting_review
                                        ? "50%"
                                        : "0%",
                                    quiz_id: lesson.quiz.quiz_id,
                                    status: quizStatus,
                                });
                            }

                            let count = "";
                            if (lesson.quiz?.progress?.awaiting_review) {
                                count = "รอตรวจ";
                            } else {
                                // ใช้ข้อมูลจาก hierarchical structure
                                const videoCompleted = lesson.video_completed === true;
                                const quizPassed = lesson.quiz?.progress?.passed === true;
                                const allCompleted = videoCompleted && (!lesson.quiz || quizPassed);
                                count = allCompleted ? "ผ่าน" : "ไม่ผ่าน";
                            }

                            sections.push({
                                id: lesson.lesson_id,
                                subject_id: currentSubjectId || subject.subject_id,
                                title: `บทที่ ${lessonIndex + 1}: ${lesson.title}`,
                                count: count,
                                items: sectionItems,
                                quiz_id: lesson.quiz ? lesson.quiz.quiz_id : undefined,
                            });
                        }
                    });

                                        setLessonData(sections);
                    await updateLessonCompletionStatus(sections);

                    // ตรวจสอบว่ามีแบบทดสอบก่อนเรียนหรือไม่ และตั้งค่าเป็นบทเรียนแรก
                    // ให้รอให้ LessonFaq โหลดข้อมูลแบบทดสอบก่อน แล้วค่อยตั้งค่าบทเรียนแรก
                    // โดยจะตั้งค่าใน useEffect ที่จะทำงานหลังจาก subjectQuizzes โหลดเสร็จ
                } else {
                    console.log("ไม่พบบทเรียนในวิชานี้");
                }
            } else {
                console.error("ไม่สามารถโหลดข้อมูลหลักสูตรได้");
            }
        } catch (error) {
            console.error("Error fetching course data:", error);
        }
    }, [courseId, API_URL]);

    // โหลดข้อมูลแบบทดสอบก่อน/หลังเรียน (ใช้ useCallback เพื่อป้องกัน re-creation)
    const fetchSubjectQuizzes = useCallback(async () => {
        if (!currentSubjectId) return;

        console.log("📚 เริ่มโหลดข้อมูลแบบทดสอบสำหรับ subjectId:", currentSubjectId);

        try {
            const response = await axios.get(
                `${API_URL}/api/learn/subject/${currentSubjectId}/quizzes`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                const quizzes: any[] = [];
                // --- ดึงข้อมูล big pre/post test ---
                let bigPreTestCompleted = false;
                if (response.data.pre_test) {
                    const bigPreTest = response.data.pre_test;
                    bigPreTestCompleted = bigPreTest.progress?.passed || false;
                    console.log("📝 พบแบบทดสอบก่อนเรียน:", bigPreTest.title, "Status:", bigPreTest.progress?.status);
                    quizzes.push({
                        quiz_id: bigPreTest.quiz_id,
                        title: bigPreTest.title || "แบบทดสอบก่อนเรียนใหญ่",
                        description: bigPreTest.description,
                        type: "big_pre_test", // แยกจาก pre-test ของแต่ละบทเรียน
                        locked: false,
                        completed: bigPreTest.progress?.completed || false,
                        passed: bigPreTest.progress?.passed || false,
                        status: bigPreTest.progress?.awaiting_review ? "awaiting_review" :
                                bigPreTest.progress?.passed ? "passed" :
                                bigPreTest.progress?.completed ? "failed" : "not_started",
                        score: bigPreTest.progress?.score,
                        max_score: bigPreTest.progress?.max_score,
                    });
                } else {
                    console.log("⚠️ ไม่พบแบบทดสอบก่อนเรียน");
                }
                
                // --- เช็คว่าทุกบทเรียนผ่านหรือยัง ---
                let allLessonsPassed = true;
                let totalItems = 0;
                let completedItems = 0;
                
                if (lessonData.length > 0) {
                    for (const section of lessonData) {
                        // นับทุก item ใน section (ไม่ว่าจะมี quiz หรือไม่)
                        for (const item of section.items) {
                            totalItems++;
                            if (item.completed) completedItems++;
                        }
                    }
                    
                    // ตรวจสอบว่าเรียนผ่านครบ 90% หรือไม่
                    const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
                    
                    // ต้องผ่านอย่างน้อย 90% ของทั้งหมด
                    if (overallProgress < 90) {
                        allLessonsPassed = false;
                    }
                    
                    console.log("🔒 Post-test unlock check:", {
                        bigPreTestCompleted: bigPreTestCompleted,
                        overallProgress: `${(overallProgress || 0).toFixed(1)}% (${completedItems}/${totalItems})`,
                        allLessonsPassed,
                        totalSections: lessonData.length,
                        debug: {
                            totalSections: lessonData.length,
                            allItems: lessonData.map(section => ({
                                sectionTitle: section.title,
                                items: section.items.map(item => ({
                                    title: item.title,
                                    type: item.type,
                                    completed: item.completed
                                }))
                            }))
                        }
                    });
                }
                
                // --- post test ---
                if (response.data.post_test) {
                    const postTest = response.data.post_test;
                                    // ล็อค posttest ถ้า big pretest ยังไม่ผ่าน หรือ บทเรียนยังไม่ผ่านครบ
                let locked = false;
                if (!bigPreTestCompleted || !allLessonsPassed) {
                    locked = true;
                }
                    
                    console.log("🔒 Post-test locking decision:", {
                        bigPreTestCompleted: bigPreTestCompleted,
                        allLessonsPassed,
                        locked,
                        postTestId: postTest.quiz_id
                    });
                    
                    quizzes.push({
                        quiz_id: postTest.quiz_id,
                        title: postTest.title || "แบบทดสอบหลังเรียน",
                        description: postTest.description,
                        type: "post_test",
                        locked,
                        completed: postTest.progress?.passed === true || postTest.progress?.awaiting_review === true,
                        passed: postTest.progress?.passed === true,
                        status: postTest.progress?.awaiting_review ? "awaiting_review" :
                                postTest.progress?.passed ? "passed" :
                                postTest.progress?.completed ? "failed" : "not_started",
                        score: postTest.progress?.score,
                        max_score: postTest.progress?.max_score,
                    });
                }
                setSubjectQuizzes(quizzes);
                console.log("✅ โหลดข้อมูลแบบทดสอบเสร็จสิ้น:", quizzes.length, "รายการ");
            }
        } catch (error) {
            console.error("Error fetching subject quizzes:", error);
            setSubjectQuizzes([]);
        }
    }, [currentSubjectId, API_URL, lessonData]);

    // ✅ Task 3: โหลดข้อมูลอาจารย์ประจำหลักสูตร
    const fetchInstructors = useCallback(async () => {
        console.log("🎓 Fetching instructors for courseId:", courseId);
        try {
            const response = await axios.get(
                `${API_URL}/api/courses/${courseId}/instructors`
            );
            
            console.log("🎓 Instructors API response:", response.data);
            
            if (response.data.success) {
                console.log("🎓 Setting instructors:", response.data.instructors);
                setInstructors(response.data.instructors);
            }
        } catch (error) {
            console.error("❌ Error fetching instructors:", error);
            setInstructors([]);
        }
    }, [courseId, API_URL]);

    // ✅ Task 5: ลบ fetchPaymentStatus function
    // const fetchPaymentStatus = useCallback(async () => {
    //     if (!currentSubjectId) return;

    //     try {
    //         const response = await axios.get(
    //             `${API_URL}/api/learn/subject/${currentSubjectId}/payment-status`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                 },
    //             }
    //         );

    //         if (response.data.success) {
    //             setPaymentStatus(response.data);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching payment status:", error);
    //         setPaymentStatus(null);
    //     }
    // }, [currentSubjectId, API_URL]);

    // // ✅ Task 2: หาบทเรียนล่าสุดที่ยังไม่ได้เรียน
    // const findNextUncompletedLesson = () => {
    //     // หาบทเรียนแรกที่ยังไม่เสร็จ
    //     for (let sectionIndex = 0; sectionIndex < lessonData.length; sectionIndex++) {
    //         const section = lessonData[sectionIndex];
    //         for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
    //             const item = section.items[itemIndex];
    //             // หาบทเรียนที่ยังไม่เสร็จและไม่ถูกล็อค
    //             if (!item.completed && !item.lock) {
    //                 console.log(`🎯 Found next uncompleted lesson: ${item.title} (${item.type})`);
    //                 return {
    //                     section,
    //                     item,
    //                     sectionIndex,
    //                     itemIndex
    //                 };
    //             }
    //         }
    //     }
        
    //     // ถ้าทุกบทเรียนเสร็จแล้ว ให้ตรวจสอบแบบทดสอบหลังเรียน
    //     const postTest = subjectQuizzes.find(q => q.type === "post_test");
    //     if (postTest && !postTest.completed && !postTest.locked) {
    //         console.log("🎯 All lessons completed, post-test is available");
    //         return {
    //             isPostTest: true,
    //             postTest
    //         };
    //     } else if (postTest && postTest.locked) {
    //         console.log("🔒 Post-test is locked - checking requirements...");
            
    //         // ตรวจสอบว่า pre-test ผ่านหรือยัง
    //         const preTest = subjectQuizzes.find(q => q.type === "pre_test");
    //         if (preTest && !preTest.completed) {
    //             console.log("🔒 Post-test locked: Pre-test not completed");
    //         }
            
    //         // ตรวจสอบ progress ของ video และ quiz
    //         let totalVideoItems = 0;
    //         let completedVideoItems = 0;
    //         let totalQuizItems = 0;
    //         let completedQuizItems = 0;
            
    //         lessonData.forEach(section => {
    //             section.items.forEach(item => {
    //                 if (item.type === "video") {
    //                     totalVideoItems++;
    //                     if (item.completed) completedVideoItems++;
    //                 } else if (item.type === "quiz") {
    //                     totalQuizItems++;
    //                     if (item.completed) completedQuizItems++;
    //                 }
    //             });
    //         });
            
    //         const videoProgress = totalVideoItems > 0 ? (completedVideoItems / totalVideoItems) * 100 : 0;
    //         const quizProgress = totalQuizItems > 0 ? (completedQuizItems / totalQuizItems) * 100 : 0;
            
    //         console.log("🔒 Post-test locked: Progress check", {
    //             videoProgress: `${videoProgress.toFixed(1)}% (${completedVideoItems}/${totalVideoItems})`,
    //             quizProgress: `${quizProgress.toFixed(1)}% (${completedQuizItems}/${totalQuizItems})`,
    //             required: "90% for both video and quiz"
    //         });
    //     }
        
    //     console.log("🎯 All content completed!");
    //     return null; // ทุกอย่างเสร็จหมดแล้ว
    // };

    // ตั้งค่าบทเรียนแรก
    const setInitialLesson = () => {
        if (initialLessonSet) return;

        // console.log("🎯 setInitialLesson เริ่มทำงาน");
        // console.log("📚 subjectQuizzes:", subjectQuizzes);
        // console.log("📖 lessonData:", lessonData);

        // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
        // เมื่ออยู่ใน big pre-test และกดปุ่ม "บทเรียนถัดไป"
        if (currentLessonId && currentLessonId.startsWith("-1000-")) {
            console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ใน big pre-test");
            return;
        }
        
        // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
        // เมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน
        if (currentLessonId && currentLessonId.includes("-")) {
            console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน");
            return;
        }

        // ✅ หาบทเรียนที่ยังไม่ได้เรียนเป็นลำดับแรก
        const bigPreTest = subjectQuizzes.find(q => q.type === "big_pre_test");
        
        // ✅ ตรวจสอบว่าแบบทดสอบก่อนเรียนเสร็จแล้วหรือไม่
        if (bigPreTest && !bigPreTest.completed) {
            console.log("🎯 แสดงแบบทดสอบก่อนเรียนเพราะยังไม่ได้ทำ:", bigPreTest.title);
            setCurrentLessonId(`-1000-${bigPreTest.quiz_id}`);
            setCurrentLesson(bigPreTest.title);
            setCurrentView("quiz");
            setCurrentLessonData({
                id: bigPreTest.quiz_id,
                lesson_id: 0,
                title: bigPreTest.title,
                lock: false,
                completed: bigPreTest.completed || false,
                type: "quiz",
                quizType: "special",
                duration: bigPreTest.completed ? "100%" : "0%",
                quiz_id: bigPreTest.quiz_id,
                status: bigPreTest.status || "not_started"
            });
            setCurrentQuizData(null);
            setSidebarActiveAccordion(-1000);
            intendedAccordionState.current = -1000;
            console.log("🎯 Set intendedAccordionState to -1000 for big pre-test");
        } else {
            // ✅ หาบทเรียนที่ยังไม่ได้เรียนเป็นลำดับแรก
            let foundLesson = false;
            
            for (let sectionIndex = 0; sectionIndex < lessonData.length; sectionIndex++) {
                const section = lessonData[sectionIndex];
                for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
                    const item = section.items[itemIndex];
                    // ✅ หาบทเรียนแรกที่ไม่ถูกล็อคและยังไม่ได้เรียน
                    if (!item.lock && !item.completed) {
                        console.log(`🎯 ตั้งค่าบทเรียนที่ยังไม่ได้เรียน: ${item.title}`);
                        
                        setCurrentLessonId(`${section.id}-${itemIndex}`);
                        setCurrentLesson(item.title);
                        setCurrentView(item.type);
                        setCurrentLessonData({
                            ...item,
                            quiz_id: item.type === "quiz" ? item.quiz_id : section.quiz_id,
                            big_lesson_id: section.id,
                        });

                        // ✅ ตั้งค่า YouTube ID ให้ถูกต้องสำหรับวิดีโอทันที
                        if (item.type === "video" && item.video_url) {
                            const videoId = extractYoutubeId(item.video_url);
                            if (videoId) {
                                setYoutubeId(videoId);
                                console.log("🎥 ตั้งค่า YouTube ID สำหรับวิดีโอ:", videoId);
                            } else {
                                console.log("⚠️ ไม่สามารถสกัด YouTube ID จาก URL:", item.video_url);
                            }
                        }

                        if (item.type === "quiz" && courseData) {
                            const lesson = courseData.subjects[0]?.lessons.find(
                                (l) => l.lesson_id === section.id
                            );
                            
                            if (lesson && lesson.is_big_lesson) {
                                const subLesson = lesson.sub_lessons?.find(
                                    (sl: any) => sl.lesson_id === section.id
                                );
                                if (subLesson && subLesson.quiz) {
                                    setCurrentQuizData(subLesson.quiz);
                                } else if (lesson.quiz && lesson.quiz.quiz_id === item.quiz_id) {
                                    setCurrentQuizData(lesson.quiz);
                                }
                            } else if (lesson && lesson.quiz) {
                                setCurrentQuizData(lesson.quiz);
                            }
                        }
                        
                        // อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                        // setSidebarActiveAccordion(section.id); // ✅ ลบการเปลี่ยน accordion state เพื่อป้องกันการปิด
                        intendedAccordionState.current = section.id;
                        console.log("🎯 Setting intendedAccordionState to:", section.id, "for video lesson:", item.title);
                        console.log("🎥 ไปบทเรียนถัดไป (video):", item.title);
                        foundLesson = true;
                        break;
                    }
                }
                if (foundLesson) break;
            }
            
            // ✅ ถ้าไม่พบบทเรียนที่ยังไม่ได้เรียน ให้ตรวจสอบแบบทดสอบหลังเรียน
            if (!foundLesson) {
                const postTest = subjectQuizzes.find(q => q.type === "post_test");
                if (postTest && !postTest.locked && !postTest.completed) {
                    console.log("🎯 แสดงแบบทดสอบหลังเรียนเพราะยังไม่ได้ทำ:", postTest.title);
                    
                    setCurrentLessonId(`-2000-${postTest.quiz_id}`);
                    setCurrentLesson(postTest.title);
                    setCurrentView("quiz");
                    setCurrentLessonData({
                        id: postTest.quiz_id,
                        lesson_id: 0,
                        title: postTest.title,
                        lock: false,
                        completed: postTest.completed || false,
                        type: "quiz",
                        quizType: "special",
                        duration: postTest.completed ? "100%" : "0%",
                        quiz_id: postTest.quiz_id,
                        status: postTest.status || "not_started"
                    });
                    setCurrentQuizData(null);
                    setSidebarActiveAccordion(-2000);
                    intendedAccordionState.current = -2000;
                    foundLesson = true;
                } else if (lessonData.length > 0 && lessonData[0].items.length > 0) {
                    // ✅ Fallback: ใช้บทเรียนแรกที่ยังไม่ได้เรียน
                    console.log("🎯 Fallback - หาบทเรียนแรกที่ยังไม่ได้เรียน");
                    let fallbackFound = false;
                    
                    for (let sectionIndex = 0; sectionIndex < lessonData.length; sectionIndex++) {
                        const section = lessonData[sectionIndex];
                        for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
                            const item = section.items[itemIndex];
                            if (!item.lock) {
                                console.log(`🎯 Fallback - ใช้บทเรียน: ${item.title}`);
                                setCurrentLessonId(`${section.id}-${itemIndex}`);
                                setCurrentLesson(item.title);
                                setCurrentView(item.type);
                    setCurrentLessonData({
                                    ...item,
                                    quiz_id: section.quiz_id,
                                    big_lesson_id: section.id,
                                });
                                fallbackFound = true;
                                break;
                            }
                        }
                        if (fallbackFound) break;
                    }

                    // ✅ ตั้งค่า YouTube ID และ Quiz Data สำหรับ fallback
                    if (fallbackFound) {
                        const currentItem = lessonData.find(s => s.id === parseInt(currentLessonId.split('-')[0]))?.items[parseInt(currentLessonId.split('-')[1])];
                        if (currentItem) {
                            if (currentItem.type === "video" && currentItem.video_url) {
                                const videoId = extractYoutubeId(currentItem.video_url);
                        if (videoId) {
                            setYoutubeId(videoId);
                            console.log("🎥 ตั้งค่า YouTube ID สำหรับ fallback:", videoId);
                        } else {
                                    console.log("⚠️ ไม่สามารถสกัด YouTube ID จาก fallback URL:", currentItem.video_url);
                                    setYoutubeId("");
                        }
                            } else if (currentItem.type === "quiz") {
                                setYoutubeId("");
                    }
                        }
                    }
                }
            }
        }
        
        console.log("✅ setInitialLesson เสร็จสิ้น");
        setInitialLessonSet(true);
    };

    useEffect(() => {
        const initializeData = async () => {
            try {
                console.log("🚀 เริ่มต้น initializeData สำหรับ courseId:", courseId, "subjectId:", subjectId);
                setLoading(true);
                
                // Reset states เมื่อเปลี่ยนวิชา
                setInitialLessonSet(false);
                setSubjectQuizzes([]);
                setCurrentLessonId("");
                setCurrentLesson("");
                setCurrentView("video");
                setCurrentLessonData(null);
                setCurrentQuizData(null);
                // ✅ ไม่ต้อง reset YouTube ID ที่นี่
                setSidebarActiveAccordion(null);
                intendedAccordionState.current = null;
                // ✅ Reset progress และ status states
                setProgress(0);
                // ✅ Reset refresh flag เมื่อเปลี่ยนวิชา
                refreshInProgressRef.current = false;
                
                // ✅ Reset completion status flag เมื่อเปลี่ยนวิชา
                setCompletionStatusSent(false);
                
                // ✅ ล้าง flag เมื่อเปลี่ยนวิชา
                localStorage.removeItem('hasLeftBigPreTest');
                
                console.log("🔄 Reset states เสร็จสิ้น");
                
                // ✅ เพิ่มการตรวจสอบว่า intendedAccordionState ถูกตั้งค่าหรือไม่
                console.log("🔄 intendedAccordionState after reset:", intendedAccordionState.current);
                
                // โหลดข้อมูลใหม่
                await Promise.all([
                    fetchCourseData(),
                    fetchInstructors()
                ]);
                
                console.log("✅ โหลดข้อมูลเสร็จสิ้น");
                
            } catch (error) {
                console.error("Error initializing data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        initializeData();
    }, [courseId, subjectId, fetchCourseData, fetchInstructors]);

    // โหลดความคืบหน้าของวิชาเมื่อมีการเปลี่ยนวิชา (ใช้ useCallback เพื่อป้องกัน re-creation)
    const fetchSubjectProgress = useCallback(async () => {
        if (!currentSubjectId) return;

        try {
            const response = await axios.get(
                `${API_URL}/api/learn/subject/${currentSubjectId}/progress`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.success) {
                const { progress_percentage } = response.data.progress;
                // ✅ ใช้ progress จาก backend แทนการคำนวณเอง
                setProgress(progress_percentage || 0);
                // console.log(`📊 Subject progress from backend: ${progress_percentage}%`);
            }
        } catch (error) {
            console.error("Error fetching subject progress:", error);
        }
    }, [currentSubjectId, API_URL]);
    useEffect(() => {
        fetchSubjectProgress();
    }, [currentSubjectId]);

    // โหลดข้อมูลแบบทดสอบเมื่อ subjectId เปลี่ยน
    useEffect(() => {
        if (currentSubjectId) {
            console.log("🔄 เริ่มโหลดข้อมูลแบบทดสอบเมื่อ subjectId เปลี่ยน:", currentSubjectId);
            Promise.allSettled([
                fetchSubjectQuizzes()
                // ✅ Task 5: ลบการเรียก fetchPaymentStatus
                // fetchPaymentStatus()
            ]).then(results => {
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(`Error in subject data loading ${index}:`, result.reason);
                    }
                });
                console.log("✅ การโหลดข้อมูลแบบทดสอบเสร็จสิ้น");
            });
        }
    }, [currentSubjectId]);

    // ✅ แก้ไข Progress Calculation useEffect เพื่อใช้ progress จาก backend แทน
    useEffect(() => {
        if (lessonData.length > 0) {
            // ✅ ใช้ progress จาก backend แทนการคำนวณเอง
            // Progress จะถูกคำนวณโดย updateSubjectProgress และ updateCourseProgress ใน backend
            // และส่งกลับมาใน response ของ video progress และ quiz submission
            
            // console.log("🎯 Using progress from backend - no local calculation needed");
        }
    }, [lessonData]);

    // ✅ ลบ Progress Calculation useEffect เดิมที่คำนวณเอง
    // useEffect(() => {
    //     if (lessonData.length > 0) {
    //         let totalItems = 0;
    //         let completedItems = 0;

    //         lessonData.forEach(section => {
    //             section.items.forEach(item => {
    //                 totalItems++;
    //                 if (item.completed) {
    //                     completedItems++;
    //                 }
    //             });
    //         });

    //         const newProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            
    //         // ✅ เพิ่มการตรวจสอบว่า progress เปลี่ยนจริงหรือไม่
    //         if (Math.abs(newProgress - progress) > 0.1) {
    //             console.log("🎯 Progress calculation:", { completedItems, totalItems, newProgress, currentProgress: progress });
                
    //             // ✅ ใช้ setTimeout เพื่อป้องกันการกระพริบ
    //             const timeoutId = setTimeout(() => {
    //                 setProgress(newProgress);
    //             }, 100);
                
    //             return () => clearTimeout(timeoutId);
    //         }
    //     }
    // }, [lessonData, progress]);

    // ✅ ปรับสูตร progress bar ให้ใช้ฟังก์ชันใหม่ calculateOverallProgress
    useEffect(() => {
        // ต้องรอให้ scoreStructure โหลดเสร็จ
        if (!scoreStructure || !scoreStructure.big_lessons) return;
        
        // ใช้ฟังก์ชันใหม่ calculateOverallProgress
        const calculatedProgress = calculateOverallProgress();
        
        // ✅ ป้องกันการ update progress ที่ไม่จำเป็น และป้องกันการกระพริบ
        if (Math.abs(calculatedProgress - progress) > 0.1) {
            console.log("📊 New Overall Progress calculation:", {
                calculatedProgress: calculatedProgress.toFixed(1) + "%",
                previousProgress: (progress || 0).toFixed(1) + "%",
                scoreStructure: scoreStructure
            });
            
            // ✅ ใช้ setTimeout เพื่อป้องกันการกระพริบ
            setTimeout(() => {
                setProgress(calculatedProgress);
            }, 50);
        }
    }, [scoreStructure, calculateOverallProgress, progress]); // ✅ เพิ่ม dependencies

    // ตั้งค่าบทเรียนแรกเมื่อข้อมูลพร้อม
    useEffect(() => {
        if (!loading && lessonData.length > 0 && !initialLessonSet) {
            // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
            // เมื่ออยู่ใน big pre-test และกดปุ่ม "บทเรียนถัดไป"
            if (currentLessonId && currentLessonId.startsWith("-1000-")) {
                console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ใน big pre-test (useEffect 1)");
                return;
            }
            
            // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
            // เมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน
            if (currentLessonId && currentLessonId.includes("-")) {
                console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน");
                return;
            }
            
            // ถ้าไม่มีข้อมูลแบบทดสอบเลย ให้ตั้งค่าบทเรียนแรก
            if (subjectQuizzes.length === 0) {
                setInitialLesson();
            }
        }
    }, [loading, lessonData, subjectQuizzes, initialLessonSet]);

    // useEffect สำหรับดึงข้อมูลคะแนน
    useEffect(() => {
        if (currentSubjectId) {
            fetchScoreItems();
        }
    }, [currentSubjectId, fetchScoreItems]);



    // ✅ เพิ่ม useEffect สำหรับ reset state เมื่อ currentLessonId เปลี่ยน
    useEffect(() => {
        // Reset state เมื่อเปลี่ยนบทเรียน
        if (currentLessonId) {
            console.log("🔄 Reset state เมื่อเปลี่ยนบทเรียน:", currentLessonId);
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำเมื่ออยู่ใน big pre-test
            if (currentLessonId.startsWith("-1000-")) {
                console.log("🎯 ป้องกันการ reset state เมื่ออยู่ใน big pre-test");
                return;
            }
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำเมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน
            if (initialLessonSet && currentLessonId.includes("-")) {
                console.log("🎯 ป้องกันการ reset state เมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน");
                return;
            }
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำเมื่อ currentLessonId เป็นค่าว่าง
            if (currentLessonId === "") {
                console.log("🎯 ป้องกันการ reset state เมื่อ currentLessonId เป็นค่าว่าง");
                return;
            }
            
            // ไม่ต้อง reset YouTube ID ที่นี่ เพราะจะถูกตั้งค่าใหม่ใน handleSelectLesson
            // Reset progress เมื่อเปลี่ยนบทเรียน
            setProgress(0);
        }
    }, [currentLessonId, initialLessonSet]);

    // ✅ เพิ่ม useEffect สำหรับ reset state เมื่อ currentLessonData เปลี่ยน
    useEffect(() => {
        // Reset state เมื่อเปลี่ยนข้อมูลบทเรียน
        if (currentLessonData) {
            console.log("🔄 Reset state เมื่อเปลี่ยนข้อมูลบทเรียน:", currentLessonData.title, "Type:", currentLessonData.type);
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำเมื่ออยู่ใน big pre-test
            if (currentLessonId && currentLessonId.startsWith("-1000-")) {
                console.log("🎯 ป้องกันการ reset state เมื่ออยู่ใน big pre-test (currentLessonData)");
                return;
            }
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำเมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน
            if (initialLessonSet && currentLessonId && currentLessonId.includes("-")) {
                console.log("🎯 ป้องกันการ reset state เมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน (currentLessonData)");
                return;
            }
            
            // ไม่ต้อง reset YouTube ID ที่นี่ เพราะจะถูกตั้งค่าใหม่ใน handleSelectLesson
            // Reset progress เมื่อเปลี่ยนข้อมูลบทเรียน
            setProgress(0);
        }
    }, [currentLessonData, currentLessonId, initialLessonSet]);

    // ✅ เพิ่ม useEffect สำหรับ reset state เมื่อ currentQuizData เปลี่ยน
    useEffect(() => {
        // Reset state เมื่อเปลี่ยนข้อมูลแบบทดสอบ
        if (currentQuizData) {
            console.log("🔄 Reset state เมื่อเปลี่ยนข้อมูลแบบทดสอบ");
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำเมื่ออยู่ใน big pre-test
            if (currentLessonId && currentLessonId.startsWith("-1000-")) {
                console.log("🎯 ป้องกันการ reset state เมื่ออยู่ใน big pre-test (currentQuizData)");
                return;
            }
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำเมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน
            if (initialLessonSet && currentLessonId && currentLessonId.includes("-")) {
                console.log("🎯 ป้องกันการ reset state เมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน (currentQuizData)");
                return;
            }
            
            // ไม่ต้อง reset YouTube ID ที่นี่ เพราะจะถูกตั้งค่าใหม่ใน handleSelectLesson
            // Reset progress เมื่อเปลี่ยนข้อมูลแบบทดสอบ
            setProgress(0);
        }
    }, [currentQuizData, currentLessonId, initialLessonSet]);





    // ตั้งค่าบทเรียนแรกเมื่อข้อมูลแบบทดสอบโหลดเสร็จ
    useEffect(() => {
        if (!loading && lessonData.length > 0 && subjectQuizzes.length > 0 && !initialLessonSet) {
            // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
            // เมื่ออยู่ใน big pre-test และกดปุ่ม "บทเรียนถัดไป"
            if (currentLessonId && currentLessonId.startsWith("-1000-")) {
                console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ใน big pre-test (useEffect 2)");
                return;
            }
            
            // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
            // เมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน
            if (currentLessonId && currentLessonId.includes("-")) {
                console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน (useEffect 2)");
                return;
            }
            
            console.log("🎯 ข้อมูลพร้อมแล้ว เริ่มตั้งค่าบทเรียนแรก");
            setInitialLesson();
        }
    }, [subjectQuizzes, loading, lessonData, initialLessonSet]);

    // ✅ เพิ่ม useEffect สำหรับตั้งค่าบทเรียนแรกเมื่อข้อมูลพร้อม (fallback)
    useEffect(() => {
        if (!loading && lessonData.length > 0 && !initialLessonSet) {
            // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
            // เมื่ออยู่ใน big pre-test และกดปุ่ม "บทเรียนถัดไป"
            if (currentLessonId && currentLessonId.startsWith("-1000-")) {
                console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ใน big pre-test (useEffect 3)");
                return;
            }
            
            // ✅ เพิ่มการป้องกันไม่ให้ setInitialLesson ถูกเรียกซ้ำ
            // เมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน
            if (currentLessonId && currentLessonId.includes("-")) {
                console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ในระหว่างการเปลี่ยนบทเรียน (useEffect 3)");
                return;
            }
            
            // ถ้าไม่มีข้อมูลแบบทดสอบเลย ให้ตั้งค่าบทเรียนแรก
            if (subjectQuizzes.length === 0) {
                console.log("🎯 ไม่มีข้อมูลแบบทดสอบ ใช้ fallback");
                setInitialLesson();
            }
        }
    }, [loading, lessonData, subjectQuizzes, initialLessonSet]);

    // ✅ เพิ่มฟังก์ชันสำหรับอัปเดตสถานะการเรียนจบอัตโนมัติ
    const updatePaymentStatus = useCallback(async () => {
        if (!currentSubjectId || completionStatusSent) return;

        try {
            // ตรวจสอบว่าเรียนจบแล้วหรือไม่
            if (progress >= 100) {
                // อัปเดตสถานะใน enrollments
                await axios.post(
                    `${API_URL}/api/learn/subject/${currentSubjectId}/update-completion`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                
                console.log("✅ อัปเดตสถานะการเรียนจบสำเร็จ");
                setCompletionStatusSent(true); // ✅ ตั้งค่า flag เพื่อป้องกันการเรียกซ้ำ
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    }, [currentSubjectId, progress, API_URL, completionStatusSent]);

    // ✅ เพิ่มฟังก์ชันสำหรับตรวจสอบและอัปเดต quiz state
    const updateQuizState = useCallback(async (quizId: number) => {
        if (!quizId) return;
        
        try {
            console.log("🔄 Updating quiz state for quizId:", quizId);
            
            // เรียก API เพื่อดึงข้อมูล quiz state ล่าสุด
            const response = await axios.get(
                `${API_URL}/api/learn/quiz/${quizId}/progress`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            
            if (response.data.success) {
                const quizProgress = response.data.progress;
                console.log("🔄 Quiz progress from API:", quizProgress);
                
                // อัปเดต lessonData ด้วยข้อมูลล่าสุด
                setLessonData((prevData) => {
                    return prevData.map((section) => {
                        const updatedItems = section.items.map((item) => {
                            if (item.quiz_id === quizId) {
                                const updatedItem = {
                                    ...item,
                                    completed: quizProgress.completed || quizProgress.passed || quizProgress.awaiting_review,
                                    status: (quizProgress.awaiting_review ? "awaiting_review" : 
                                           quizProgress.passed ? "passed" : 
                                           quizProgress.completed ? "failed" : "failed") as "passed" | "failed" | "awaiting_review"
                                };
                                console.log("🔄 Updated item:", updatedItem);
                                return updatedItem;
                            }
                            return item;
                        });
                        
                        return {
                            ...section,
                            items: updatedItems
                        };
                    });
                });
            }
        } catch (error) {
            console.error("Error updating quiz state:", error);
        }
    }, [API_URL]);

    // ✅ เพิ่ม useEffect เพื่อเรียกใช้ฟังก์ชัน
    useEffect(() => {
        if (progress >= 100 && !completionStatusSent) {
            updatePaymentStatus();
        }
    }, [progress, updatePaymentStatus, completionStatusSent]);

    // ✅ ลบ useEffect ที่ซ้ำซ้อนและทำให้เกิด infinite loop
    // useEffect(() => {
    //     console.log("🎯 LessonArea sidebarActiveAccordion changed to:", sidebarActiveAccordion);
    //     
    //     // ✅ เพิ่มการตรวจสอบว่า accordion state ถูกเปลี่ยนแปลงโดยใคร
    //     const stackTrace = new Error().stack;
    //     console.log("🎯 Accordion state change stack trace:", stackTrace);
    // }, [sidebarActiveAccordion]);

    // ✅ เพิ่ม useEffect หลักเพื่อป้องกัน accordion ปิดตลอดเวลา
    // useEffect(() => {
    //     // ถ้ามี intendedAccordionState และไม่ใช่ null ให้รักษาไว้เสมอ
    //     if (intendedAccordionState.current !== null) {
    //         console.log("🎯 LessonArea continuously protecting accordion state:", intendedAccordionState.current);
    //         
    //         // ตรวจสอบว่า accordion state ตรงกับที่ต้องการหรือไม่
    //         if (sidebarActiveAccordion !== intendedAccordionState.current) {
    //             console.log("🎯 Accordion state mismatch detected, restoring...");
    //             setSidebarActiveAccordion(intendedAccordionState.current);
    //         }
    //     }
    // }, [sidebarActiveAccordion]); // ✅ เพิ่ม dependency array เพื่อป้องกัน infinite loop

    // อัปเดตสถานะการเรียนจบของแต่ละบทเรียน
    const updateLessonCompletionStatus = async (data: SectionData[]) => {
        try {
            let hasChanges = false;
            const updatedLessonData = [...data];

            // สร้าง array ของ promises เพื่อเรียก API พร้อมกัน
            const videoProgressPromises: Promise<{ sectionIndex: number; itemIndex: number; progress: any }>[] = [];

            updatedLessonData.forEach((section, sectionIndex) => {
                section.items.forEach((item, itemIndex) => {
                    if (item.type === "video") {
                        const promise = axios.get(
                            `${API_URL}/api/learn/lesson/${item.lesson_id}/video-progress`,
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }
                        ).then(response => ({
                            sectionIndex,
                            itemIndex,
                            progress: response.data.success ? response.data.progress : null
                        })).catch(error => {
                            console.error(`Error fetching progress for lesson ${item.lesson_id}:`, error);
                            return { sectionIndex, itemIndex, progress: null };
                        });
                        
                        videoProgressPromises.push(promise);
                    }
                });
            });

            // รอให้ทุก API call เสร็จ
            const progressResults = await Promise.allSettled(videoProgressPromises);

            // อัปเดต state ตามผลลัพธ์
            progressResults.forEach((result) => {
                if (result.status === 'fulfilled' && result.value.progress) {
                    const { sectionIndex, itemIndex, progress } = result.value;
                    const item = updatedLessonData[sectionIndex].items[itemIndex];
                    const newCompleted = progress.video_completed;
                    
                    if (item.completed !== newCompleted) {
                        item.completed = newCompleted;
                        item.duration = newCompleted ? "100%" : "0%";
                        item.status = newCompleted ? "passed" : "failed";
                        hasChanges = true;
                        
                        // ปลดล็อค quiz ถัดไปใน section เดียวกัน
                        const nextItem = updatedLessonData[sectionIndex].items.find(
                            (i) => i.id === item.id + 1 && i.type === "quiz"
                        );
                        if (nextItem) {
                            nextItem.lock = false;
                            console.log(`🔓 Unlocked quiz: ${nextItem.title} after video completion`);
                        }
                    }
                }
            });

            // อัปเดต section count
            updatedLessonData.forEach((section) => {
                // ใช้ข้อมูลจาก hierarchical structure แทน
                const sectionFromHierarchical = scoreStructure?.big_lessons?.find((bl: any) => bl.id === section.id);
                if (sectionFromHierarchical) {
                    const videoCompleted = sectionFromHierarchical.lessons?.every((lesson: any) => lesson.video_completed === true) || false;
                    const quizPassed = sectionFromHierarchical.quiz?.progress?.passed === true;
                    const allCompleted = videoCompleted && (!sectionFromHierarchical.quiz || quizPassed);
                    const checkAwating = sectionFromHierarchical.quiz?.progress?.awaiting_review === true;
                    const newCount = checkAwating ? "รอตรวจ" : allCompleted ? "ผ่าน" : "ไม่ผ่าน";
                    
                    if (section.count !== newCount) {
                        section.count = newCount;
                        hasChanges = true;
                    }
                }
            });

            if (hasChanges) {
                setLessonData(updatedLessonData);
            }
        } catch (error) {
            console.error("Error in updateLessonCompletionStatus:", error);
        }
    };

    // ฟังก์ชันเมื่อบทเรียนเสร็จสิ้น
    const handleLessonComplete = async () => {
        const [sectionId, itemId] = currentLessonId.split("-").map(Number);
        
        console.log("🎯 handleLessonComplete called:", { sectionId, itemId, currentLessonId });
        console.log("🎯 Current lesson data:", currentLessonData);
        console.log("🎯 Current view:", currentView);
    
        // อัปเดต state ท้องถิ่นก่อน (optimistic update)
        setLessonData((prevLessonData) => {
            const updatedData = prevLessonData.map((section) => {
                if (section.id === sectionId) {
                    const updatedItems = section.items.map((item, index) => {
                        if (item.id === itemId) {
                            const updatedItem = {
                                ...item,
                                completed: true,
                                duration: "100%",
                                status: item.quizType === "special_fill_in_blank" && item.status !== "passed" ? "awaiting_review" : "passed"
                            };
                            
                            // ปลดล็อค item ถัดไปเฉพาะเมื่อ video เสร็จแล้ว
                            if (item.type === "video" && index + 1 < section.items.length) {
                                const nextItem = section.items[index + 1];
                                // ปลดล็อคเฉพาะ quiz ที่อยู่ถัดไป
                                if (nextItem.type === "quiz") {
                                    section.items[index + 1] = {
                                        ...nextItem,
                                        lock: false
                                    };
                                    console.log(`🔓 Unlocked quiz: ${nextItem.title} after video completion`);
                                }
                            }
                            return updatedItem as LessonItem;
                        }
                        return item;
                    });
    
                    const allCompleted = updatedItems.every((item) => item.completed);
                    const checkAwating = updatedItems.some((item) => item.status === "awaiting_review");
    
                    return {
                        ...section,
                        items: updatedItems,
                        count: checkAwating ? "รอตรวจ" : allCompleted ? "ผ่าน" : section.count,
                    };
                }
                return section;
            });

            return updatedData;
        });

        // รอให้ state update เสร็จแล้วค่อย refresh ข้อมูลจาก API
        try {
            // ✅ เพิ่มการป้องกันการ refresh ซ้ำโดยใช้ ref
            if (!refreshInProgressRef.current) {
                refreshInProgressRef.current = true;
                
                console.log("🔄 Starting lesson refresh after completion...");
                
                // ✅ อัปเดต quiz state ถ้าเป็น quiz
                if (currentView === "quiz" && currentLessonData?.quiz_id) {
                    console.log("🔄 Updating quiz state after completion:", currentLessonData.quiz_id);
                    await updateQuizState(currentLessonData.quiz_id);
                }
                
                // ✅ สำหรับ video completion ให้ refresh ข้อมูลทันที
                if (currentView === "video" && currentLessonData?.lesson_id) {
                    console.log("🔄 Updating video completion status for lesson:", currentLessonData.lesson_id);
                    
                    // รอสักครู่เพื่อให้ database อัปเดตเสร็จ
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Refresh ข้อมูลแบบทดสอบและบทเรียนโดยไม่ reset sidebar
                    await refreshLessonDataWithoutReset();
                    
                    // ✅ อัปเดต lesson completion status โดยตรง
                    await updateLessonCompletionStatus(lessonData);
                } else {
                    // Refresh ข้อมูลแบบทดสอบและบทเรียนโดยไม่ reset sidebar
                    await refreshLessonDataWithoutReset();
                }
                
                // Reset flag หลังจากเสร็จสิ้น
                setTimeout(() => {
                    refreshInProgressRef.current = false;
                }, 2000); // ✅ เพิ่มเวลาเป็น 2 วินาที
            
            console.log("✅ Lesson completed successfully - staying on current lesson");
            } else {
                console.log("⚠️ Lesson refresh already in progress, skipping...");
            }
        } catch (error) {
            console.error("Error refreshing progress:", error);
            // Reset flag ในกรณีที่เกิด error
            refreshInProgressRef.current = false;
        }
    };

    // ฟังก์ชันค้นหาและตั้งค่าบทเรียนถัดไป (ใช้ useCallback เพื่อป้องกัน re-creation)
    const findAndSetNextLesson = useCallback((
        currentSectionId: number,
        currentItemId: number,
        updatedData: SectionData[]
    ) => {
        console.log("🔍 Finding next lesson:", { currentSectionId, currentItemId, updatedData });
        console.log("🔍 Current lesson data:", currentLessonData);
        console.log("🔍 Current view:", currentView);
        
        let foundNext = false;

        // ✅ แก้ไข: ตรวจสอบว่ากำลังอยู่ใน big pre-test หรือไม่
        if (currentSectionId === -1000) {
            console.log("🎯 กำลังอยู่ใน big pre-test - ไปบทเรียนแรกที่สามารถเรียนได้");
            
            // ✅ เพิ่มการป้องกันการ reset state ซ้ำ
            // ตั้งค่า flag เพื่อป้องกันการเรียก setInitialLesson ซ้ำ
            setInitialLessonSet(true);
            
            // ✅ เพิ่มการป้องกันไม่ให้กลับไป Big Pre-test อีก
            // โดยการตั้งค่า flag ว่าได้ออกจาก Big Pre-test แล้ว
            localStorage.setItem('hasLeftBigPreTest', 'true');
            
            // หาบทเรียนแรกที่สามารถเรียนได้ (ไม่ถูกล็อค)
            for (let s = 0; s < updatedData.length; s++) {
                const section = updatedData[s];
                for (let i = 0; i < section.items.length; i++) {
                    const item = section.items[i];
                    if (!item.lock) {
                        console.log(`🎯 ไปบทเรียนแรกที่สามารถเรียนได้: ${item.title}`);
                        
                        // ✅ ตั้งค่า state ทันทีโดยไม่ใช้ setTimeout
                        setCurrentLessonId(`${section.id}-${i}`);
                        setCurrentLesson(item.title);
                        setCurrentView(item.type);
                        setCurrentLessonData({
                            ...item,
                            quiz_id: item.type === "quiz" ? item.quiz_id : section.quiz_id,
                            big_lesson_id: section.id,
                        });

                        // ตั้งค่า YouTube ID สำหรับวิดีโอ
                        if (item.type === "video" && item.video_url) {
                            const videoId = extractYoutubeId(item.video_url);
                            if (videoId) {
                                setYoutubeId(videoId);
                                console.log("🎥 ตั้งค่า YouTube ID สำหรับวิดีโอ:", videoId);
                            } else {
                                console.log("⚠️ ไม่สามารถสกัด YouTube ID จาก URL:", item.video_url);
                            }
                        } else if (item.type === "quiz") {
                            setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                        }
                        
                        // ตั้งค่า Quiz Data สำหรับแบบทดสอบ
                        if (item.type === "quiz") {
                            setCurrentQuizDataFromLesson(item, section);
                        }
                        
                        // ✅ อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                        // และป้องกันการกลับไป Big Pre-test อีก
                        intendedAccordionState.current = section.id;
                        console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for video lesson:", item.title);
                        console.log("🎥 ไปบทเรียนถัดไป (video):", item.title);
                        foundNext = true;
                        break;
                    }
                }
                if (foundNext) break;
            }
            
            // ✅ ถ้าไม่พบบทเรียนที่สามารถเรียนได้ ให้ไป post-test แทน
            if (!foundNext) {
                console.log("🔍 ไม่พบบทเรียนที่สามารถเรียนได้ - ไป post-test แทน");
                const postTest = subjectQuizzes.find(q => q.type === "post_test");
                if (postTest && !postTest.locked) {
                    setCurrentLessonId(`-2000-${postTest.quiz_id}`);
                    setCurrentLesson(postTest.title);
                    setCurrentView("quiz");
                    setYoutubeId("");
                    setCurrentLessonData({
                        id: postTest.quiz_id,
                        lesson_id: 0,
                        title: postTest.title,
                        lock: false,
                        completed: postTest.completed || false,
                        type: "quiz",
                        quizType: "special",
                        duration: postTest.completed ? "100%" : "0%",
                        quiz_id: postTest.quiz_id,
                        status: postTest.status || "not_started"
                    });
                    setCurrentQuizData(null);
                    setSidebarActiveAccordion(-2000);
                    intendedAccordionState.current = -2000;
                    foundNext = true;
                }
            }
            
            return foundNext;
        }

        // ✅ ตรวจสอบว่าบทเรียนปัจจุบันมีแบบทดสอบหรือไม่
        const currentSection = updatedData.find((s) => s.id === currentSectionId);
        const currentItem = currentSection?.items[currentItemId];
        
        console.log("🔍 Current section and item:", { currentSection, currentItem, currentSectionId, currentItemId });
        
        if (currentItem && currentItem.type === "video") {
            // ✅ ถ้าบทเรียนปัจจุบันเป็น video ให้ตรวจสอบว่ามีแบบทดสอบหรือไม่
            if (currentItem.quiz_id) {
                console.log("🎯 บทเรียนปัจจุบันมีแบบทดสอบ - ไปทำแบบทดสอบก่อน");
                
                // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                setCurrentLessonData({
                    ...currentItem,
                    quiz_id: currentItem.quiz_id,
                    big_lesson_id: currentSection.id,
                });
                
                setCurrentQuizDataFromLesson(currentItem, currentSection);
                setCurrentView("quiz");
                setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                return true;
            }
        }
        
        // ✅ ถ้าเป็นแบบทดสอบท้ายบท ให้ไปบทเรียนถัดไป (section ถัดไป)
        if (currentItem && currentItem.type === "quiz") {
            console.log("🎯 บทเรียนปัจจุบันเป็นแบบทดสอบท้ายบท - ไปบทเรียนถัดไป");
            
            // ✅ ตรวจสอบว่าเป็น Big Lesson Quiz หรือไม่
            if (currentItem.title.includes("แบบทดสอบท้ายบทใหญ่")) {
                console.log("🎯 เป็น Big Lesson Quiz - ไป post-test หรือจบหลักสูตร");
                
                // ตรวจสอบว่ามีแบบทดสอบหลังเรียนหรือไม่
                const postTest = subjectQuizzes.find(q => q.type === "post_test");
                if (postTest && !postTest.locked) {
                    console.log("✅ Found post-test as next content:", postTest.title);
                    
                    setCurrentLessonId(`-2000-${postTest.quiz_id}`);
                    setCurrentLesson(postTest.title);
                    setCurrentView("quiz");
                    setYoutubeId(""); // Reset YouTube ID สำหรับแบบทดสอบ
                    
                    setCurrentLessonData({
                        id: postTest.quiz_id,
                        lesson_id: 0,
                        title: postTest.title,
                        lock: false,
                        completed: postTest.completed || false,
                        type: "quiz",
                        quizType: "special",
                        duration: postTest.completed ? "100%" : "0%",
                        quiz_id: postTest.quiz_id,
                        status: postTest.status || "not_started"
                    });
                    setCurrentQuizData(null);
                    
                    // อัปเดต sidebarActiveAccordion ให้ตรงกับแบบทดสอบหลังเรียน
                    setSidebarActiveAccordion(-2000);
                    
                    foundNext = true;
                    return foundNext;
                } else {
                    console.log("🎉 Course completed! No more lessons or quizzes available.");
                    alert("ยินดีด้วย! คุณได้เรียนจบหลักสูตรนี้แล้ว 🎉");
                    return true;
                }
            }
            
            // ✅ ตรวจสอบว่าเป็น Sub Lesson Quiz (1.1.2) หรือไม่
            if (currentItem.title.includes("แบบทดสอบท้ายบท") && !currentItem.title.includes("ใหญ่")) {
                console.log("🎯 เป็น Sub Lesson Quiz - ไป Big Lesson Quiz (1.X)");
                
                // หา Big Lesson Quiz ใน section เดียวกัน
                const bigLessonQuiz = currentSection.items.find(item => 
                    item.title.includes("แบบทดสอบท้ายบทใหญ่")
                );
                
                if (bigLessonQuiz && !bigLessonQuiz.lock) {
                    console.log("✅ Found Big Lesson Quiz:", bigLessonQuiz.title);
                    
                    setCurrentLessonId(`${currentSectionId}-${bigLessonQuiz.id}`);
                    setCurrentLesson(bigLessonQuiz.title);
                    
                    // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                    setCurrentLessonData({
                        ...bigLessonQuiz,
                        quiz_id: bigLessonQuiz.quiz_id,
                        big_lesson_id: currentSection.id,
                    });
                    
                    setCurrentQuizDataFromLesson(bigLessonQuiz, currentSection);
                    setCurrentView("quiz");
                    setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                    
                    // อัปเดต sidebarActiveAccordion ให้ตรงกับ section เดียวกัน
                    intendedAccordionState.current = currentSectionId;
                    
                    foundNext = true;
                    return foundNext;
                }
            }
            
            // ✅ ตรวจสอบว่าเป็น Big Lesson Quiz (1.X) หรือไม่
            if (currentItem.title.includes("แบบทดสอบท้ายบทใหญ่")) {
                console.log("🎯 เป็น Big Lesson Quiz - ไปบทเรียนถัดไป (section ถัดไป)");
                
                // ✅ แก้ไข: หา section ถัดไปในลำดับที่ถูกต้อง
                const currentSectionIndex = updatedData.findIndex(s => s.id === currentSectionId);
                console.log("🔍 Current section index:", currentSectionIndex, "Total sections:", updatedData.length);
                
                if (currentSectionIndex !== -1 && currentSectionIndex + 1 < updatedData.length) {
                    // หา section ถัดไปในลำดับ
                    const nextSection = updatedData[currentSectionIndex + 1];
                    console.log("✅ Found next section in sequence:", nextSection.id, nextSection.title);
                    
                    // ค้นหา item แรกใน section ถัดไป
                    for (let i = 0; i < nextSection.items.length; i++) {
                        const item = nextSection.items[i];
                        console.log(`🔍 Checking next section ${nextSection.id}, item ${i}:`, item.title, "Lock:", item.lock, "Complete:", item.completed);
                        
                        if (!item.lock) {
                            if (item.type === "video" && item.video_url) {
                                const videoId = extractYoutubeId(item.video_url);
                                if (videoId) {
                                    setCurrentLessonId(`${nextSection.id}-${i}`);
                                    setCurrentLesson(item.title);
                                    setCurrentLessonData(item);
                                    setCurrentView("video");
                                    setYoutubeId(videoId);
                                    
                                    // อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                                    intendedAccordionState.current = nextSection.id;
                                    console.log("🎯 Setting sidebarActiveAccordion to:", nextSection.id, "for next video lesson:", item.title);
                                    console.log("🎥 Going to next lesson (video):", item.title);
                                    return true;
                                }
                            } else if (item.type === "quiz") {
                                setCurrentLessonId(`${nextSection.id}-${i}`);
                                setCurrentLesson(item.title);
                                
                                // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                                setCurrentLessonData({
                                    ...item,
                                    quiz_id: item.quiz_id,
                                    big_lesson_id: nextSection.id,
                                });
                                
                                setCurrentQuizDataFromLesson(item, nextSection);
                                setCurrentView("quiz");
                                setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                                
                                // อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                                intendedAccordionState.current = nextSection.id;
                                console.log("🎯 Setting sidebarActiveAccordion to:", nextSection.id, "for next quiz lesson:", item.title);
                                console.log("📝 Going to next lesson (quiz):", item.title, "with quiz_id:", item.quiz_id);
                                return true;
                            }
                        }
                    }
                    
                    // ถ้าไม่พบ item ที่สามารถเรียนได้ใน section ถัดไป ให้ไป section ถัดไปอีก
                    console.log("🔍 ไม่พบ item ที่สามารถเรียนได้ใน section ถัดไป - ไป section ถัดไปอีก");
                    for (let s = currentSectionIndex + 2; s < updatedData.length; s++) {
                        const section = updatedData[s];
                        for (let i = 0; i < section.items.length; i++) {
                            const item = section.items[i];
                            if (!item.lock) {
                                if (item.type === "video" && item.video_url) {
                                    const videoId = extractYoutubeId(item.video_url);
                                    if (videoId) {
                                        setCurrentLessonId(`${section.id}-${i}`);
                                        setCurrentLesson(item.title);
                                        setCurrentLessonData(item);
                                        setCurrentView("video");
                                        setYoutubeId(videoId);
                                        intendedAccordionState.current = section.id;
                                        console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for next available video lesson:", item.title);
                                        console.log("🎥 Going to next available lesson (video):", item.title);
                                        foundNext = true;
                                        break;
                                    }
                                } else if (item.type === "quiz") {
                                    setCurrentLessonId(`${section.id}-${i}`);
                                    setCurrentLesson(item.title);
                                    setCurrentLessonData({
                                        ...item,
                                        quiz_id: item.quiz_id,
                                        big_lesson_id: section.id,
                                    });
                                    setCurrentQuizDataFromLesson(item, section);
                                    setCurrentView("quiz");
                                    setYoutubeId("");
                                    intendedAccordionState.current = section.id;
                                    console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for next available quiz lesson:", item.title);
                                    console.log("📝 Going to next available lesson (quiz):", item.title, "with quiz_id:", item.quiz_id);
                                    foundNext = true;
                                    break;
                                }
                            }
                        }
                        if (foundNext) break;
                    }
                    
                    if (foundNext) {
                        return foundNext;
                    }
                } else {
                    console.log("🔍 ไม่มี section ถัดไปในลำดับ - ไป post-test");
                }
                
                // ถ้าไม่พบบทเรียนถัดไป ให้ไป post-test
                console.log("🔍 ไม่พบบทเรียนถัดไป - ไป post-test");
                const postTest = subjectQuizzes.find(q => q.type === "post_test");
                if (postTest && !postTest.locked) {
                    console.log("✅ Found post-test as next content:", postTest.title);
                    
                    setCurrentLessonId(`-2000-${postTest.quiz_id}`);
                    setCurrentLesson(postTest.title);
                    setCurrentView("quiz");
                    setYoutubeId(""); // Reset YouTube ID สำหรับแบบทดสอบ
                    
                    setCurrentLessonData({
                        id: postTest.quiz_id,
                        lesson_id: 0,
                        title: postTest.title,
                        lock: false,
                        completed: postTest.completed || false,
                        type: "quiz",
                        quizType: "special",
                        duration: postTest.completed ? "100%" : "0%",
                        quiz_id: postTest.quiz_id,
                        status: postTest.status || "not_started"
                    });
                    setCurrentQuizData(null);
                    
                    // อัปเดต sidebarActiveAccordion ให้ตรงกับแบบทดสอบหลังเรียน
                    setSidebarActiveAccordion(-2000);
                    intendedAccordionState.current = -2000;
                    
                    console.log("📝 Going to post-test:", postTest.title);
                    return true;
                } else {
                    console.log("🎉 Course completed! No more lessons or quizzes available.");
                    alert("ยินดีด้วย! คุณได้เรียนจบหลักสูตรนี้แล้ว 🎉");
                    return true;
                }
            }
            
            // ✅ ตรวจสอบว่าเป็น quiz อื่นๆ หรือไม่
            console.log("🎯 เป็น quiz อื่นๆ - ไป item ถัดไปใน section เดียวกัน");
            
            // ✅ แก้ไข: ไป item ถัดไปใน section เดียวกันแทนที่จะเรียก findAndSetNextLesson ซ้ำ
            if (currentSection && currentItemId + 1 < currentSection.items.length) {
                const nextItem = currentSection.items[currentItemId + 1];
                console.log(`🔍 Checking next item in same section:`, nextItem.title, "Lock:", nextItem.lock, "Complete:", nextItem.completed);
                
                if (!nextItem.lock) {
                    if (nextItem.type === "video" && nextItem.video_url) {
                        const videoId = extractYoutubeId(nextItem.video_url);
                        if (videoId) {
                            setCurrentLessonId(`${currentSectionId}-${currentItemId + 1}`);
                            setCurrentLesson(nextItem.title);
                            setCurrentLessonData(nextItem);
                            setCurrentView("video");
                            setYoutubeId(videoId);
                            console.log("🎥 ไป item ถัดไปใน section เดียวกัน (video):", nextItem.title);
                            return true;
                        }
                    } else if (nextItem.type === "quiz") {
                        setCurrentLessonId(`${currentSectionId}-${currentItemId + 1}`);
                        setCurrentLesson(nextItem.title);
                        
                        setCurrentLessonData({
                            ...nextItem,
                            quiz_id: nextItem.quiz_id,
                            big_lesson_id: currentSection.id,
                        });
                        
                        setCurrentQuizDataFromLesson(nextItem, currentSection);
                        setCurrentView("quiz");
                        setYoutubeId("");
                        console.log("📝 ไป item ถัดไปใน section เดียวกัน (quiz):", nextItem.title, "with quiz_id:", nextItem.quiz_id);
                        return true;
                    }
                }
            }
            
            // ✅ ถ้าไม่มี item ถัดไปใน section เดียวกัน ให้ไป section ถัดไป
            console.log("🔍 ไม่มี item ถัดไปใน section เดียวกัน - ไป section ถัดไป");
            
            for (let s = 0; s < updatedData.length; s++) {
                const section = updatedData[s];
                
                // ข้าม section ปัจจุบัน
                if (section.id === currentSectionId) {
                    continue;
                }
                
                // ค้นหา item แรกใน section นี้
                for (let i = 0; i < section.items.length; i++) {
                    const item = section.items[i];
                    console.log(`🔍 Checking section ${section.id}, item ${i}:`, item.title, "Lock:", item.lock, "Complete:", item.completed);
                    
                    if (!item.lock) {
                        if (item.type === "video" && item.video_url) {
                            const videoId = extractYoutubeId(item.video_url);
                            if (videoId) {
                                setCurrentLessonId(`${section.id}-${i}`);
                                setCurrentLesson(item.title);
                                setCurrentLessonData(item);
                                setCurrentView("video");
                                setYoutubeId(videoId);
                                intendedAccordionState.current = section.id;
                                console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for video lesson:", item.title);
                                console.log("🎥 ไปบทเรียนถัดไป (video):", item.title);
                                return true;
                            }
                        } else if (item.type === "quiz") {
                            setCurrentLessonId(`${section.id}-${i}`);
                            setCurrentLesson(item.title);
                            
                            setCurrentLessonData({
                                ...item,
                                quiz_id: item.quiz_id,
                                big_lesson_id: section.id,
                            });
                            
                            setCurrentQuizDataFromLesson(item, section);
                            setCurrentView("quiz");
                            setYoutubeId("");
                            intendedAccordionState.current = section.id;
                            console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for quiz lesson:", item.title);
                            console.log("📝 ไปบทเรียนถัดไป (quiz):", item.title, "with quiz_id:", item.quiz_id);
                            return true;
                        }
                    }
                }
            }
            
            // ✅ ถ้าไม่พบบทเรียนถัดไป ให้ไป post-test
            console.log("🔍 ไม่พบบทเรียนถัดไป - ไป post-test");
            const postTest = subjectQuizzes.find(q => q.type === "post_test");
            if (postTest && !postTest.locked) {
                console.log("✅ Found post-test as next content:", postTest.title);
                
                setCurrentLessonId(`-2000-${postTest.quiz_id}`);
                setCurrentLesson(postTest.title);
                setCurrentView("quiz");
                setYoutubeId(""); // Reset YouTube ID สำหรับแบบทดสอบ
                
                setCurrentLessonData({
                    id: postTest.quiz_id,
                    lesson_id: 0,
                    title: postTest.title,
                    lock: false,
                    completed: postTest.completed || false,
                    type: "quiz",
                    quizType: "special",
                    duration: postTest.completed ? "100%" : "0%",
                    quiz_id: postTest.quiz_id,
                    status: postTest.status || "not_started"
                });
                setCurrentQuizData(null);
                
                // อัปเดต sidebarActiveAccordion ให้ตรงกับแบบทดสอบหลังเรียน
                setSidebarActiveAccordion(-2000);
                intendedAccordionState.current = -2000;
                
                console.log("📝 Going to post-test:", postTest.title);
                return true;
            }
            
            console.log("🎉 Course completed! No more lessons or quizzes available.");
            alert("ยินดีด้วย! คุณได้เรียนจบหลักสูตรนี้แล้ว 🎉");
            return true;
        }
        
        // ✅ ถ้าไม่มีแบบทดสอบหรือเป็นแบบทดสอบแล้ว ให้ไปบทเรียนถัดไป
        
        // 1. ค้นหาใน section เดียวกันก่อน (ถ้ามี item ถัดไป)
        if (currentSection && currentItemId + 1 < currentSection.items.length) {
            const nextItem = currentSection.items[currentItemId + 1];
            console.log(`🔍 Checking next item in same section:`, nextItem.title, "Lock:", nextItem.lock, "Complete:", nextItem.completed);
            
            if (!nextItem.lock) {
                if (nextItem.type === "video" && nextItem.video_url) {
                    const videoId = extractYoutubeId(nextItem.video_url);
                    if (videoId) {
                        setCurrentLessonId(`${currentSectionId}-${currentItemId + 1}`);
                        setCurrentLesson(nextItem.title); // ✅ เพิ่มการอัปเดตชื่อบทเรียน
                        setCurrentLessonData(nextItem);
                        setCurrentView("video");
                        setYoutubeId(videoId);
                        console.log("🎥 ไป item ถัดไปใน section เดียวกัน (video):", nextItem.title);
                        foundNext = true;
                    }
                } else if (nextItem.type === "quiz") {
                    setCurrentLessonId(`${currentSectionId}-${currentItemId + 1}`);
                    setCurrentLesson(nextItem.title); // ✅ เพิ่มการอัปเดตชื่อบทเรียน
                    
                    // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                    setCurrentLessonData({
                        ...nextItem,
                        quiz_id: nextItem.quiz_id,
                        big_lesson_id: currentSection.id,
                    });
                    
                    setCurrentQuizDataFromLesson(nextItem, currentSection);
                    setCurrentView("quiz");
                    setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                    console.log("📝 ไป item ถัดไปใน section เดียวกัน (quiz):", nextItem.title, "with quiz_id:", nextItem.quiz_id);
                    foundNext = true;
                }
            }
        }
        
        // 2. ถ้าไม่มี item ถัดไปใน section เดียวกัน ให้ไป section ถัดไป
        if (!foundNext) {
            console.log("🔍 ไม่มี item ถัดไปใน section เดียวกัน - ไป section ถัดไป");
            
            for (let s = 0; s < updatedData.length; s++) {
                const section = updatedData[s];
                
                // ข้าม section ปัจจุบัน
                if (section.id === currentSectionId) {
                    continue;
                }
                
                // ค้นหา item แรกใน section นี้
                for (let i = 0; i < section.items.length; i++) {
                    const item = section.items[i];
                    console.log(`🔍 Checking section ${section.id}, item ${i}:`, item.title, "Lock:", item.lock, "Complete:", item.completed);
                    
                    if (!item.lock) {
                        if (item.type === "video" && item.video_url) {
                            const videoId = extractYoutubeId(item.video_url);
                            if (videoId) {
                                setCurrentLessonId(`${section.id}-${i}`);
                                setCurrentLesson(item.title); // ✅ เพิ่มการอัปเดตชื่อบทเรียน
                                setCurrentLessonData(item);
                                setCurrentView("video");
                                setYoutubeId(videoId);
                                // ✅ อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                                console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for video lesson:", item.title);
                                intendedAccordionState.current = section.id;
                                console.log("🎥 ไปบทเรียนถัดไป (video):", item.title);
                                foundNext = true;
                                break;
                            }
                        } else if (item.type === "quiz") {
                            setCurrentLessonId(`${section.id}-${i}`);
                            setCurrentLesson(item.title); // ✅ เพิ่มการอัปเดตชื่อบทเรียน
                            
                            // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                            setCurrentLessonData({
                                ...item,
                                quiz_id: item.quiz_id,
                                big_lesson_id: section.id,
                            });
                            
                            setCurrentQuizDataFromLesson(item, section);
                            setCurrentView("quiz");
                            setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                            // ✅ อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                            console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for quiz lesson:", item.title);
                            intendedAccordionState.current = section.id;
                            console.log("📝 ไปบทเรียนถัดไป (quiz):", item.title, "with quiz_id:", item.quiz_id);
                            foundNext = true;
                            break;
                        }
                    }
                }
                
                if (foundNext) break;
            }
        }
        
        // 3. ถ้าไม่พบบทเรียนถัดไป (เป็น lesson สุดท้าย) ให้ไป posttest ใหญ่
        if (!foundNext) {
            console.log("🔍 ไม่พบบทเรียนถัดไป - ไป posttest ใหญ่ของ biglesson");
            
            // ตรวจสอบว่ามีแบบทดสอบหลังเรียนหรือไม่
            const postTest = subjectQuizzes.find(q => q.type === "post_test");
            if (postTest && !postTest.locked) {
                console.log("✅ Found post-test as next content:", postTest.title);
                
                setCurrentLessonId(`-2000-${postTest.quiz_id}`);
                setCurrentLesson(postTest.title);
                setCurrentView("quiz");
                setYoutubeId(""); // Reset YouTube ID สำหรับแบบทดสอบ
                
                setCurrentLessonData({
                    id: postTest.quiz_id,
                    lesson_id: 0,
                    title: postTest.title,
                    lock: false,
                    completed: postTest.completed || false,
                    type: "quiz",
                    quizType: "special",
                    duration: postTest.completed ? "100%" : "0%",
                    quiz_id: postTest.quiz_id,
                    status: postTest.status || "not_started"
                });
                setCurrentQuizData(null);
                
                // อัปเดต sidebarActiveAccordion ให้ตรงกับแบบทดสอบหลังเรียน
                setSidebarActiveAccordion(-2000);
                
                foundNext = true;
            }
        }

        if (!foundNext) {
            console.log("🎉 Course completed! No more lessons or quizzes available.");
            // แสดงข้อความว่าจบหลักสูตรแล้ว
            alert("ยินดีด้วย! คุณได้เรียนจบหลักสูตรนี้แล้ว 🎉");
        }
        
        return foundNext;
    }, [courseData, extractYoutubeId, subjectQuizzes]);

    // ✅ เพิ่มฟังก์ชันใหม่สำหรับการไปบทเรียนถัดไป (lesson ถัดไป) โดยเฉพาะสำหรับแบบทดสอบของแต่ละบท
    const goToNextLesson = useCallback(() => {
        console.log("🚀 goToNextLesson called - going to next lesson (section) instead of next item");
        
        if (!currentLessonId || !lessonData) {
            console.error("❌ Missing currentLessonId or lessonData");
            return;
        }
        
        const [sectionId, itemId] = currentLessonId.split("-").map(Number);
        console.log("🔍 Going to next lesson from section:", sectionId, "item:", itemId);
        
        // ✅ ตรวจสอบว่ากำลังอยู่ใน big pre-test หรือไม่
            if (sectionId === -1000) {
                console.log("🎯 ป้องกันการเรียก setInitialLesson ซ้ำเมื่ออยู่ใน big pre-test");
                setInitialLessonSet(true);
            localStorage.setItem('hasLeftBigPreTest', 'true');
        }
        
        // ✅ ตรวจสอบว่ากำลังอยู่ใน post-test หรือไม่
        if (sectionId === -2000) {
            console.log("🎯 กำลังอยู่ใน post-test - ไม่มีอะไรถัดไป");
            alert("คุณได้เรียนจบหลักสูตรนี้แล้ว! 🎉");
                        return;
            }
            
        // ✅ ใช้ findAndSetNextLesson เพื่อไปบทเรียนถัดไป
            findAndSetNextLesson(sectionId, itemId, lessonData);
            console.log("✅ Next lesson navigation completed");
        
    }, [currentLessonId, lessonData, findAndSetNextLesson]);

    // ✅ ฟังก์ชันใหม่สำหรับไปที่เนื้อหาล่าสุดที่ดูได้
    const goToLatestAvailableContent = useCallback(() => {
        console.log("🎯 goToLatestAvailableContent called - finding latest available content");
        
        if (!lessonData || lessonData.length === 0) {
            console.error("❌ No lesson data available");
            return;
        }
        
        // ✅ ตรวจสอบแบบทดสอบก่อนเรียนก่อน
        const bigPreTest = subjectQuizzes.find(q => q.type === "big_pre_test");
        if (bigPreTest && !bigPreTest.completed) {
            console.log("🎯 ไปที่แบบทดสอบก่อนเรียนเพราะยังไม่ได้ทำ:", bigPreTest.title);
            setCurrentLessonId(`-1000-${bigPreTest.quiz_id}`);
            setCurrentLesson(bigPreTest.title);
            setCurrentView("quiz");
            setCurrentLessonData({
                id: bigPreTest.quiz_id,
                lesson_id: 0,
                title: bigPreTest.title,
                lock: false,
                completed: bigPreTest.completed || false,
                type: "quiz",
                quizType: "special",
                duration: bigPreTest.completed ? "100%" : "0%",
                quiz_id: bigPreTest.quiz_id,
                status: bigPreTest.status || "not_started"
            });
            setCurrentQuizData(null);
            setSidebarActiveAccordion(-1000);
            intendedAccordionState.current = -1000;
            return;
        }
        
        // ✅ หาเนื้อหาล่าสุดที่ยังไม่จบ
        let latestUncompletedContent = null;
        let latestSectionId = null;
        let latestItemId = null;
        
        // ไล่จาก section แรกไป section สุดท้าย
        for (let sectionIndex = 0; sectionIndex < lessonData.length; sectionIndex++) {
            const section = lessonData[sectionIndex];
            
            // ไล่จาก item แรกไป item สุดท้ายใน section
            for (let itemIndex = 0; itemIndex < section.items.length; itemIndex++) {
                const item = section.items[itemIndex];
                
                // ตรวจสอบว่าไม่ถูกล็อคและยังไม่จบ
                if (!item.lock && !item.completed) {
                    latestUncompletedContent = item;
                    latestSectionId = section.id;
                    latestItemId = itemIndex;
                    console.log(`🎯 พบเนื้อหาล่าสุดที่ยังไม่จบ: ${item.title} (Section: ${section.id}, Item: ${itemIndex})`);
                }
            }
        }
        
        // ✅ ถ้าพบเนื้อหาที่ยังไม่จบ ให้ไปที่นั้น
        if (latestUncompletedContent && latestSectionId !== null && latestItemId !== null) {
            console.log(`🎯 ไปที่เนื้อหาล่าสุดที่ยังไม่จบ: ${latestUncompletedContent.title}`);
            
            setCurrentLessonId(`${latestSectionId}-${latestItemId}`);
            setCurrentLesson(latestUncompletedContent.title);
            setCurrentView(latestUncompletedContent.type);
            setCurrentLessonData({
                ...latestUncompletedContent,
                quiz_id: latestUncompletedContent.type === "quiz" ? latestUncompletedContent.quiz_id : lessonData.find(s => s.id === latestSectionId)?.quiz_id,
                big_lesson_id: latestSectionId,
            });
            
            // ตั้งค่า YouTube ID สำหรับวิดีโอ
            if (latestUncompletedContent.type === "video" && latestUncompletedContent.video_url) {
                const videoId = extractYoutubeId(latestUncompletedContent.video_url);
                if (videoId) {
                    setYoutubeId(videoId);
                    console.log("🎥 ตั้งค่า YouTube ID สำหรับเนื้อหาล่าสุด:", videoId);
                } else {
                    console.log("⚠️ ไม่สามารถสกัด YouTube ID จาก URL:", latestUncompletedContent.video_url);
                    setYoutubeId("");
                }
            } else if (latestUncompletedContent.type === "quiz") {
                setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
            }
            
            // ตั้งค่า Quiz Data สำหรับแบบทดสอบ
            if (latestUncompletedContent.type === "quiz") {
                const section = lessonData.find(s => s.id === latestSectionId);
                if (section) {
                    setCurrentQuizDataFromLesson(latestUncompletedContent, section);
                }
            }
            
            // อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
            intendedAccordionState.current = latestSectionId;
            console.log("🎯 Setting sidebarActiveAccordion to:", latestSectionId, "for latest content:", latestUncompletedContent.title);
            return;
        }
        
        // ✅ ถ้าไม่พบเนื้อหาที่ยังไม่จบ ให้ตรวจสอบแบบทดสอบหลังเรียน
        const postTest = subjectQuizzes.find(q => q.type === "post_test");
        if (postTest && !postTest.locked && !postTest.completed) {
            console.log("🎯 ไปที่แบบทดสอบหลังเรียนเพราะยังไม่ได้ทำ:", postTest.title);
            
            setCurrentLessonId(`-2000-${postTest.quiz_id}`);
            setCurrentLesson(postTest.title);
            setCurrentView("quiz");
            setCurrentLessonData({
                id: postTest.quiz_id,
                lesson_id: 0,
                title: postTest.title,
                lock: false,
                completed: postTest.completed || false,
                type: "quiz",
                quizType: "special",
                duration: postTest.completed ? "100%" : "0%",
                quiz_id: postTest.quiz_id,
                status: postTest.status || "not_started"
            });
            setCurrentQuizData(null);
            setSidebarActiveAccordion(-2000);
            intendedAccordionState.current = -2000;
            return;
        }
        
        // ✅ ถ้าไม่พบเนื้อหาที่ยังไม่จบเลย แสดงข้อความว่าจบแล้ว
        console.log("🎉 ไม่พบเนื้อหาที่ยังไม่จบ - หลักสูตรจบแล้ว");
        alert("ยินดีด้วย! คุณได้เรียนจบหลักสูตรนี้แล้ว 🎉");
        
    }, [lessonData, subjectQuizzes, extractYoutubeId]);

    // ฟังก์ชันช่วยตั้งค่า Quiz Data
    const setCurrentQuizDataFromLesson = (item: LessonItem, section: SectionData) => {
        if (!courseData) return;
        
        try {
            const lesson = courseData.subjects[0].lessons.find(
                (l) => l.lesson_id === section.id
            );
            
            if (lesson && lesson.is_big_lesson) {
                // Big Lesson - ค้นหาใน Sub Lessons
                const subLesson = lesson.sub_lessons?.find(
                    (sl: any) => sl.lesson_id === item.lesson_id
                );
                
                if (subLesson && subLesson.quiz) {
                    setCurrentQuizData(subLesson.quiz);
                    console.log("📝 Set quiz data from sub lesson:", subLesson.quiz.title);
                } else if (lesson.quiz && lesson.quiz.quiz_id === item.quiz_id) {
                    // Big Lesson Quiz
                    setCurrentQuizData(lesson.quiz);
                    console.log("📝 Set quiz data from big lesson:", lesson.quiz.title);
                }
            } else if (lesson && lesson.quiz) {
                // Lesson ปกติ
                setCurrentQuizData(lesson.quiz);
                console.log("📝 Set quiz data from regular lesson:", lesson.quiz.title);
            }
        } catch (error) {
            console.error("Error setting quiz data:", error);
        }
    };

    // ตรวจสอบว่าบทเรียนปัจจุบันเรียนจบแล้วหรือไม่ (ใช้ useMemo เพื่อหลีกเลี่ยงการคำนวณซ้ำ)
    const getCurrentLessonCompleted = useMemo(() => {
        if (!currentLessonId) return false;
        
        const [sectionId, itemId] = currentLessonId.split("-").map(Number);
        const section = lessonData.find((s) => s.id === sectionId);
        if (section) {
            const item = section.items.find((i) => i.id === itemId);
            return item?.completed || false;
        }
        return false;
    }, [currentLessonId, lessonData]);

       // ฟังก์ชันเมื่อเลือกบทเรียน (ใช้ useCallback เพื่อป้องกัน re-creation)
const handleSelectLesson = useCallback((
    sectionId: number,
    itemId: number,
    title: string,
    type: "video" | "quiz"
) => {
    console.log("🎯 handleSelectLesson called:", { sectionId, itemId, title, type });
    
    // ✅ เก็บค่า accordion state ปัจจุบันไว้
    const currentAccordionState = sidebarActiveAccordion;
    console.log("🎯 Current accordion state:", currentAccordionState);
    
    // ✅ Reset state เมื่อเลือกบทเรียนใหม่
    setCurrentView(type);
    
    // ตรวจสอบว่าเป็นแบบทดสอบพิเศษ (pre/post test) หรือไม่
    if (sectionId < 0) {
        // จัดการแบบทดสอบก่อน/หลังเรียน
        setCurrentLessonId(`${sectionId}-${itemId}`);
        setCurrentLesson(title);
        
        // ✅ Reset YouTube ID สำหรับแบบทดสอบพิเศษ
        setYoutubeId("");
        
        // สร้าง fake lesson data สำหรับแบบทดสอบพิเศษ
        const specialQuizData = {
            id: itemId,
            lesson_id: 0,
            title: title,
            lock: false,
            completed: false,
            type: type,
            quizType: "special",
            duration: "0%",
            quiz_id: itemId,
            status: "not_started" as const
        };
        
        setCurrentLessonData(specialQuizData);
        setCurrentQuizData(null);
        
        // ✅ อัปเดต accordion state สำหรับแบบทดสอบพิเศษ
        const specialAccordionId = sectionId;
        // setSidebarActiveAccordion(specialAccordionId); // ✅ ลบการเปลี่ยน accordion state เพื่อป้องกันการปิด
        intendedAccordionState.current = specialAccordionId;
        
        return;
    }

    // จัดการแบบทดสอบ/วิดีโอปกติ
    const section = lessonData.find((s) => s.id === sectionId);
    if (section) {
        const item = section.items.find((i) => i.id === itemId);
        if (item) {
            // ตรวจสอบการล็อค
            if (item.lock) {
                if (item.type === "quiz") {
                    // หา video ที่เกี่ยวข้อง
                    const relatedVideo = section.items.find(i => i.type === "video" && !i.completed);
                    if (relatedVideo) {
                        alert(`กรุณาเรียนวิดีโอบทเรียน "${relatedVideo.title}" ให้เสร็จก่อนทำแบบทดสอบ`);
                    } else {
                        alert("กรุณาเรียนบทก่อนหน้าให้เสร็จก่อนทำแบบทดสอบท้ายบท");
                    }
                } else {
                    alert("บทเรียนนี้ยังไม่พร้อมให้เรียน กรุณาเรียนบทก่อนหน้าให้เสร็จก่อน");
                }
                return;
            }

            setCurrentLessonId(`${sectionId}-${itemId}`);
            setCurrentLesson(item.title);
            setCurrentSubjectId(section.subject_id);
            
            // ✅ อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
            // setSidebarActiveAccordion(sectionId); // ✅ ลบการเปลี่ยน accordion state เพื่อป้องกันการปิด
            intendedAccordionState.current = sectionId;
            console.log("🎯 Keeping accordion state at:", sidebarActiveAccordion, "for lesson:", title);

            setCurrentLessonData({
                ...item,
                quiz_id: type === "quiz" ? item.quiz_id : section.quiz_id,
                big_lesson_id: section.id,
            });

            // ✅ ตั้งค่า YouTube ID ทันทีเมื่อเลือกบทเรียนวิดีโอ
            if (type === "video" && item.video_url) {
                const videoId = extractYoutubeId(item.video_url);
                if (videoId) {
                    setYoutubeId(videoId);
                    console.log("🎥 ตั้งค่า YouTube ID เมื่อเลือกบทเรียน:", videoId);
                } else {
                    console.log("⚠️ ไม่สามารถสกัด YouTube ID จาก URL:", item.video_url);
                    setYoutubeId("");
                }
            } else if (type === "quiz") {
                // ✅ Reset YouTube ID เมื่อเลือกแบบทดสอบ
                setYoutubeId("");
            }

            if (courseData && type === "quiz" && item.quiz_id) {
                const lesson = courseData.subjects[0].lessons.find(
                    (l) => l.lesson_id === sectionId
                );
                
                if (lesson && lesson.is_big_lesson) {
                    const subLesson = lesson.sub_lessons?.find(
                        (sl) => sl.lesson_id === sectionId
                    );
                    if (subLesson && subLesson.quiz) {
                        setCurrentQuizData(subLesson.quiz);
                    } else if (lesson.quiz && lesson.quiz.quiz_id === item.quiz_id) {
                        setCurrentQuizData(lesson.quiz);
                    }
                } else if (lesson && lesson.quiz) {
                    setCurrentQuizData(lesson.quiz);
                }
                
                // ✅ อัปเดต quiz state เพื่อให้ตรงกับ backend
                if (item.quiz_id) {
                    console.log("🔄 Updating quiz state for selected quiz:", item.quiz_id);
                    updateQuizState(item.quiz_id);
                }
            }
        }
    }
    
    // ✅ ตรวจสอบว่า accordion state ยังคงเหมือนเดิมหรือไม่
    setTimeout(() => {
        if (sidebarActiveAccordion !== currentAccordionState) {
            console.log("⚠️ Accordion state changed unexpectedly in handleSelectLesson, restoring...");
            setSidebarActiveAccordion(currentAccordionState);
            intendedAccordionState.current = currentAccordionState;
        }
    }, 50); // ✅ ลด timeout จาก 100ms เป็น 50ms
    
}, [lessonData, courseData, extractYoutubeId, sidebarActiveAccordion]);

    // ✅ เพิ่มฟังก์ชัน refreshLessonDataWithoutReset ที่หายไป
    const refreshLessonDataWithoutReset = useCallback(async () => {
        try {
            // เก็บค่า sidebarActiveAccordion ปัจจุบันไว้
            const currentActiveAccordion = sidebarActiveAccordion;
            console.log("🔄 refreshLessonDataWithoutReset - เก็บค่า sidebarActiveAccordion:", currentActiveAccordion);
            console.log("🔄 refreshLessonDataWithoutReset - currentLessonId:", currentLessonId);
            
            // ✅ เพิ่มการตรวจสอบและตั้งค่า intendedAccordionState ถ้ายังเป็น null
            if (intendedAccordionState.current === null && currentActiveAccordion !== null) {
                console.log("🎯 Setting intendedAccordionState from currentActiveAccordion:", currentActiveAccordion);
                intendedAccordionState.current = currentActiveAccordion;
            }
            
            // ✅ เพิ่มการตรวจสอบว่า currentActiveAccordion เป็น null หรือไม่
            if (currentActiveAccordion === null) {
                console.log("⚠️ currentActiveAccordion is null, trying to restore from intendedAccordionState");
                if (intendedAccordionState.current !== null) {
                    console.log("🎯 Restoring sidebarActiveAccordion from intendedAccordionState:", intendedAccordionState.current);
                    setSidebarActiveAccordion(intendedAccordionState.current);
                }
            }
            
            // ✅ คืนค่า sidebarActiveAccordion ทันทีเพื่อป้องกันการปิด accordion
            setSidebarActiveAccordion(currentActiveAccordion);
            intendedAccordionState.current = currentActiveAccordion;
            console.log("🔄 หลังเรียก setSidebarActiveAccordion - sidebarActiveAccordion state:", currentActiveAccordion);
            
            // ✅ เพิ่มการ force update sidebar ทันทีสำหรับ video completion
            if (currentView === "video") {
                console.log("🔄 Force updating sidebar for video completion...");
                // Trigger re-render ของ sidebar โดยการอัปเดต lessonData
                setLessonData(prevData => [...prevData]);
            }
            
            // ✅ เพิ่มการตรวจสอบว่า accordion state ถูกตั้งค่าถูกต้องหรือไม่
            setTimeout(() => {
                console.log("🔄 ตรวจสอบ accordion state หลังจาก refresh:", {
                    expected: currentActiveAccordion,
                    actual: sidebarActiveAccordion,
                    currentLessonId: currentLessonId,
                    intendedAccordionState: intendedAccordionState.current
                });
                
                // ✅ ถ้า accordion state ไม่ตรงกับที่คาดหวัง ให้คืนค่ากลับมา
                if (sidebarActiveAccordion !== currentActiveAccordion) {
                    console.log("⚠️ Accordion state mismatch detected, restoring...");
                    setSidebarActiveAccordion(currentActiveAccordion);
                    intendedAccordionState.current = currentActiveAccordion;
                }
                
                // ✅ เพิ่มการตรวจสอบ intendedAccordionState
                if (intendedAccordionState.current !== currentActiveAccordion) {
                    console.log("🎯 Updating intendedAccordionState to match currentActiveAccordion");
                    intendedAccordionState.current = currentActiveAccordion;
                }
            }, 50); // ✅ ลด timeout จาก 100ms เป็น 50ms
            
        } catch (error) {
            console.error("Error in refreshLessonDataWithoutReset:", error);
        }
    }, [currentSubjectId, courseId, subjectId, API_URL]);


const handleNextLesson = useCallback(() => {
        console.log("🚀 handleNextLesson called with currentLessonId:", currentLessonId);
        console.log("🚀 Current lesson data:", currentLessonData);
        console.log("🚀 Current view:", currentView);
        console.log("🚀 Lesson data length:", lessonData?.length);
        
        if (!currentLessonId || !lessonData) {
            console.error("❌ Missing currentLessonId or lessonData");
            return;
        }
        
        const [sectionId, itemId] = currentLessonId.split("-").map(Number);
        console.log("🔍 Parsed sectionId:", sectionId, "itemId:", itemId);
        
        // ✅ ตรวจสอบว่ากำลังอยู่ใน big pre-test หรือไม่
        if (sectionId === -1000) {
            console.log("🎯 กำลังอยู่ใน big pre-test - ไปบทเรียนแรก");
            findAndSetNextLesson(sectionId, itemId, lessonData);
            return;
        }
        
        // ✅ ตรวจสอบว่ากำลังอยู่ใน post-test หรือไม่
        if (sectionId === -2000) {
            console.log("🎯 กำลังอยู่ใน post-test - ไม่มีอะไรถัดไป");
            alert("คุณได้เรียนจบหลักสูตรนี้แล้ว! 🎉");
            return;
        }
        
        // ✅ ตรวจสอบว่ากำลังอยู่ใน video หรือไม่
        if (currentView === "video" && currentLessonData?.type === "video") {
            console.log("🎯 กำลังอยู่ใน video - ตรวจสอบว่ามี quiz ท้ายบทหรือไม่");
            
            const currentSection = lessonData.find(s => s.id === sectionId);
            if (currentSection) {
                // หา quiz ท้ายบทใน section เดียวกัน
                const endOfLessonQuiz = currentSection.items.find(item => 
                    item.type === "quiz" && 
                    item.title.includes("แบบทดสอบท้ายบท") && 
                    !item.title.includes("ใหญ่")
                );
                
                if (endOfLessonQuiz && !endOfLessonQuiz.lock) {
                    console.log("✅ Found end-of-lesson quiz:", endOfLessonQuiz.title);
                    
                    setCurrentLessonId(`${sectionId}-${endOfLessonQuiz.id}`);
                    setCurrentLesson(endOfLessonQuiz.title);
                    
                    // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                    setCurrentLessonData({
                        ...endOfLessonQuiz,
                        quiz_id: endOfLessonQuiz.quiz_id,
                        big_lesson_id: currentSection.id,
                    });
                    
                    setCurrentQuizDataFromLesson(endOfLessonQuiz, currentSection);
                    setCurrentView("quiz");
                    setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                    
                    console.log("📝 Going to end-of-lesson quiz:", endOfLessonQuiz.title, "with quiz_id:", endOfLessonQuiz.quiz_id);
                    return;
                }
            }
            
            // ถ้าไม่มี quiz ท้ายบท ให้ไป item ถัดไปใน section เดียวกัน
            console.log("🎯 ไม่มี quiz ท้ายบท - ไป item ถัดไปใน section เดียวกัน");
            findAndSetNextLesson(sectionId, itemId, lessonData);
            return;
        }
        
        // ✅ ตรวจสอบว่ากำลังอยู่ใน quiz หรือไม่
        if (currentView === "quiz" && currentLessonData?.type === "quiz") {
            console.log("🎯 กำลังอยู่ใน quiz - ตรวจสอบประเภทของ quiz");
            
            const currentSection = lessonData.find(s => s.id === sectionId);
            if (currentSection) {
                // ✅ ตรวจสอบว่าเป็น Sub Lesson Quiz (1.1.2) หรือไม่
                if (currentLessonData.title.includes("แบบทดสอบท้ายบท") && !currentLessonData.title.includes("ใหญ่")) {
                    console.log("🎯 เป็น Sub Lesson Quiz - ไป Big Lesson Quiz (1.X)");
                    
                    // หา Big Lesson Quiz ใน section เดียวกัน
                    const bigLessonQuiz = currentSection.items.find(item => 
                        item.type === "quiz" && 
                        item.title.includes("แบบทดสอบท้ายบทใหญ่")
                    );
                    
                    if (bigLessonQuiz && !bigLessonQuiz.lock) {
                        console.log("✅ Found Big Lesson Quiz:", bigLessonQuiz.title);
                        
                        setCurrentLessonId(`${sectionId}-${bigLessonQuiz.id}`);
                        setCurrentLesson(bigLessonQuiz.title);
                        
                        // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                        setCurrentLessonData({
                            ...bigLessonQuiz,
                            quiz_id: bigLessonQuiz.quiz_id,
                            big_lesson_id: currentSection.id,
                        });
                        
                        setCurrentQuizDataFromLesson(bigLessonQuiz, currentSection);
                        setCurrentView("quiz");
                        setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                        
                        console.log("📝 Going to Big Lesson Quiz:", bigLessonQuiz.title, "with quiz_id:", bigLessonQuiz.quiz_id);
                        return;
                    }
                }
                
                // ✅ ตรวจสอบว่าเป็น Big Lesson Quiz (1.X) หรือไม่
                if (currentLessonData.title.includes("แบบทดสอบท้ายบทใหญ่")) {
                    console.log("🎯 เป็น Big Lesson Quiz - ไปบทเรียนถัดไป (section ถัดไป)");
                    
                    // ✅ แก้ไข: หา section ถัดไปในลำดับที่ถูกต้อง
                    const currentSectionIndex = lessonData.findIndex(s => s.id === sectionId);
                    console.log("🔍 Current section index:", currentSectionIndex, "Total sections:", lessonData.length);
                    
                    if (currentSectionIndex !== -1 && currentSectionIndex + 1 < lessonData.length) {
                        // หา section ถัดไปในลำดับ
                        const nextSection = lessonData[currentSectionIndex + 1];
                        console.log("✅ Found next section in sequence:", nextSection.id, nextSection.title);
                        
                        // ค้นหา item แรกใน section ถัดไป
                        for (let i = 0; i < nextSection.items.length; i++) {
                            const item = nextSection.items[i];
                            console.log(`🔍 Checking next section ${nextSection.id}, item ${i}:`, item.title, "Lock:", item.lock, "Complete:", item.completed);
                            
                            if (!item.lock) {
                                if (item.type === "video" && item.video_url) {
                                    const videoId = extractYoutubeId(item.video_url);
                                    if (videoId) {
                                        setCurrentLessonId(`${nextSection.id}-${i}`);
                                        setCurrentLesson(item.title);
                                        setCurrentLessonData(item);
                                        setCurrentView("video");
                                        setYoutubeId(videoId);
                                        
                                        // อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                                        intendedAccordionState.current = nextSection.id;
                                        console.log("🎯 Setting sidebarActiveAccordion to:", nextSection.id, "for next video lesson:", item.title);
                                        console.log("🎥 Going to next lesson (video):", item.title);
                                        return;
                                    }
                                } else if (item.type === "quiz") {
                                    setCurrentLessonId(`${nextSection.id}-${i}`);
                                    setCurrentLesson(item.title);
                                    
                                    // ✅ อัปเดต currentLessonData ด้วย quiz_id ที่ถูกต้อง
                                    setCurrentLessonData({
                                        ...item,
                                        quiz_id: item.quiz_id,
                                        big_lesson_id: nextSection.id,
                                    });
                                    
                                    setCurrentQuizDataFromLesson(item, nextSection);
                                    setCurrentView("quiz");
                                    setYoutubeId(""); // Clear YouTube ID สำหรับ quiz
                                    
                                    // อัปเดต sidebarActiveAccordion ให้ตรงกับ section ที่เลือก
                                    intendedAccordionState.current = nextSection.id;
                                    console.log("🎯 Setting sidebarActiveAccordion to:", nextSection.id, "for next quiz lesson:", item.title);
                                    console.log("🎥 Going to next lesson (quiz):", item.title, "with quiz_id:", item.quiz_id);
                                    return;
                                }
                            }
                        }
                        
                        // ถ้าไม่พบ item ที่สามารถเรียนได้ใน section ถัดไป ให้ไป section ถัดไปอีก
                        console.log("🔍 ไม่พบ item ที่สามารถเรียนได้ใน section ถัดไป - ไป section ถัดไปอีก");
                        let foundNext = false;
                        for (let s = currentSectionIndex + 2; s < lessonData.length; s++) {
                            const section = lessonData[s];
                            for (let i = 0; i < section.items.length; i++) {
                                const item = section.items[i];
                                if (!item.lock) {
                                    if (item.type === "video" && item.video_url) {
                                        const videoId = extractYoutubeId(item.video_url);
                                        if (videoId) {
                                            setCurrentLessonId(`${section.id}-${i}`);
                                            setCurrentLesson(item.title);
                                            setCurrentLessonData(item);
                                            setCurrentView("video");
                                            setYoutubeId(videoId);
                                            intendedAccordionState.current = section.id;
                                            console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for next available video lesson:", item.title);
                                            console.log("🎥 Going to next available lesson (video):", item.title);
                                            foundNext = true;
                                            break;
                                        }
                                    } else if (item.type === "quiz") {
                                        setCurrentLessonId(`${section.id}-${i}`);
                                        setCurrentLesson(item.title);
                                        setCurrentLessonData({
                                            ...item,
                                            quiz_id: item.quiz_id,
                                            big_lesson_id: section.id,
                                        });
                                        setCurrentQuizDataFromLesson(item, section);
                                        setCurrentView("quiz");
                                        setYoutubeId("");
                                        intendedAccordionState.current = section.id;
                                        console.log("🎯 Setting sidebarActiveAccordion to:", section.id, "for next available quiz lesson:", item.title);
                                        console.log("📝 Going to next available lesson (quiz):", item.title, "with quiz_id:", item.quiz_id);
                                        foundNext = true;
                                        break;
                                    }
                                }
                            }
                            if (foundNext) break;
                        }
                        
                        if (foundNext) {
                            return;
                        }
                                        } else {
                        console.log("🔍 ไม่มี section ถัดไปในลำดับ - ไป post-test");
                    }
                    
                    // ถ้าไม่พบบทเรียนถัดไป ให้ไป post-test
                    console.log("🔍 ไม่พบบทเรียนถัดไป - ไป post-test");
                    const postTest = subjectQuizzes.find(q => q.type === "post_test");
                    if (postTest && !postTest.locked) {
                        console.log("✅ Found post-test as next content:", postTest.title);
                        
                        setCurrentLessonId(`-2000-${postTest.quiz_id}`);
                        setCurrentLesson(postTest.title);
                        setCurrentView("quiz");
                        setYoutubeId(""); // Reset YouTube ID สำหรับแบบทดสอบ
                        
                        setCurrentLessonData({
                            id: postTest.quiz_id,
                            lesson_id: 0,
                            title: postTest.title,
                            lock: false,
                            completed: postTest.completed || false,
                                                type: "quiz",
                            quizType: "special",
                            duration: postTest.completed ? "100%" : "0%",
                            quiz_id: postTest.quiz_id,
                            status: postTest.status || "not_started"
                        });
                        setCurrentQuizData(null);
                        
                        // อัปเดต sidebarActiveAccordion ให้ตรงกับแบบทดสอบหลังเรียน
                        setSidebarActiveAccordion(-2000);
                        intendedAccordionState.current = -2000;
                        
                        console.log("📝 Going to post-test:", postTest.title);
                        return;
                                        } else {
                        console.log("🎉 Course completed! No more lessons or quizzes available.");
                        alert("ยินดีด้วย! คุณได้เรียนจบหลักสูตรนี้แล้ว 🎉");
                        return;
                    }
                }
                
                // ✅ ตรวจสอบว่าเป็น quiz อื่นๆ หรือไม่
                console.log("🎯 เป็น quiz อื่นๆ - ไป item ถัดไปใน section เดียวกัน");
                findAndSetNextLesson(sectionId, itemId, lessonData);
                return;
            }
        }
        
        // ✅ ถ้าไม่ตรงกับเงื่อนไขข้างต้น ให้ใช้ findAndSetNextLesson
        console.log("🎯 ใช้ findAndSetNextLesson สำหรับการนำทางทั่วไป");
        findAndSetNextLesson(sectionId, itemId, lessonData);
        
    }, [currentLessonId, lessonData, findAndSetNextLesson, sidebarActiveAccordion, currentLessonData, currentView, subjectQuizzes, extractYoutubeId]);
            
            

    // ฟังก์ชัน refresh progress/lesson/subject (ใช้ useCallback เพื่อป้องกัน re-creation)  
    const refreshProgress = useCallback(async () => {
        try {
            setLoading(true);
            
            // ใช้ Promise.allSettled เพื่อให้ทุก API call ทำงานพร้อมกัน
            const results =             await Promise.allSettled([
                fetchCourseData(),
                fetchSubjectProgress(),
                fetchSubjectQuizzes(),
                fetchInstructors(),
                fetchScoreItems()
            ]);
            
            // ตรวจสอบ error และ log ออกมา
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Error in refreshProgress function ${index}:`, result.reason);
                }
            });
            
        } catch (error) {
            console.error("Error in refreshProgress:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchCourseData, fetchSubjectProgress, fetchSubjectQuizzes, fetchInstructors, fetchScoreItems]);



    if (loading) {
        return <LessonLoading />;
    }

    return (
        <>
        <section className="lesson__area section-pb-120" style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            padding: '40px 0'
        }}>
            <div className="container-fluid">
                <div className="row gx-4">
                    <div className="col-xl-3 col-lg-4 lesson__sidebar">
                        <div className="lesson__content" style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: 'fit-content',
                            position: 'sticky',
                            top: '20px'
                        }}>
                            <h2 className="lesson-subject-title" style={{
                                color: '#2c3e50',
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                marginBottom: '25px',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}>
                                <span className="subject-icon">📖</span>
                                <span>วิชา: {currentSubjectTitle || ""}</span>
                            </h2>
                            <LessonFaq
                                onViewChange={setCurrentView}
                                lessonData={lessonData}
                                onSelectLesson={handleSelectLesson}
                                subjectId={currentSubjectId || undefined}
                                subjectQuizzes={subjectQuizzes}
                                currentLessonId={currentLessonId}
                                activeAccordion={sidebarActiveAccordion}
                                onAccordionChange={setSidebarActiveAccordion}
                                hierarchicalData={scoreStructure}
                                onShowLockedModal={handleShowLockedModal}
                            />
                            <ScoreProgressBar
                                currentScore={calculateCurrentScore()}
                                maxScore={calculateMaxScore()}
                                passingScore={calculatePassingScore()}
                                progressPercentage={progress || calculateOverallProgress()}
                                subjectTitle={currentSubjectTitle}
                                passingPercentage={subjectPassingPercentage}
                                isSubjectPassed={isSubjectPassed()}
                            />
                            
                            {/* ✅ เพิ่มปุ่ม Debugger */}
                            <div className="debug-section mt-4" style={{
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                                borderRadius: '15px',
                                padding: '20px',
                                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                <h5 style={{
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    marginBottom: '15px',
                                    textAlign: 'center'
                                }}>
                                    🐛 Debug Console
                                </h5>
                                <button
                                    onClick={displayDebugStatus}
                                    className="btn btn-light w-100"
                                    style={{
                                        borderRadius: '12px',
                                        padding: '12px',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        border: 'none',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    🔍 Debug Learning Status
                                </button>
                                <div className="mt-3" style={{
                                    fontSize: '0.8rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    textAlign: 'center',
                                    lineHeight: '1.4'
                                }}>
                                    <p>กดปุ่มเพื่อดูสถานะการเรียนแบบละเอียดใน Console</p>
                                    <p>📱 เปิด Developer Tools (F12) ก่อนกดปุ่ม</p>
                                </div>
                            </div>
                       
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-8 lesson__main">
                    <div className="lesson__video-wrap" style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                             borderRadius: '20px',
                             padding: '30px',
                             boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                             backdropFilter: 'blur(10px)',
                             border: '1px solid rgba(255, 255, 255, 0.2)'
                         }}>
                            
                            {currentView === "quiz" ? (
                                <LessonQuiz
                                    onComplete={handleLessonComplete}
                                    isCompleted={getCurrentLessonCompleted}
                                    quizId={currentLessonData?.quiz_id || 0}
                                    quizData={currentQuizData?.questions || []}
                                    onNextLesson={handleNextLesson}
                                    lessonId={currentLessonData?.lesson_id || 0}
                                    onRefreshProgress={refreshProgress}
                                    onGoToNextLesson={goToNextLesson}
                                    onGoToLatestContent={goToLatestAvailableContent}
                                    passingPercentage={subjectPassingPercentage}
                                />
                            ) : (
                                <LessonVideo
                                    onComplete={handleLessonComplete}
                                    currentLesson={currentLesson}
                                    youtubeId={youtubeId}
                                    lessonId={currentLessonData?.lesson_id || 0}
                                    onNextLesson={handleNextLesson}
                                    onGoToNextLesson={goToNextLesson}
                                    onGoToLatestContent={goToLatestAvailableContent}
                                />
                            )}
                        </div>
                        <div className="lesson__nav-tab fixed-nav-tab" style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                             borderRadius: '20px',
                             padding: '25px',
                             marginTop: '25px',
                             boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                             backdropFilter: 'blur(10px)',
                             border: '1px solid rgba(255, 255, 255, 0.2)'
                         }}>
                             <LessonNavTav
                                description={courseData?.description || ""}
                                instructors={instructors}
                                currentLessonId={currentLessonData?.lesson_id}
                                currentBigLessonId={currentLessonData?.big_lesson_id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* ✅ Debug Modal */}
        {renderDebugModal()}

        {/* ✅ Modal สำหรับเนื้อหาที่ล็อค */}
        {showLockedModal && lockedContentData && (
            <div 
                className="locked-content-modal-overlay" 
                onClick={handleCloseLockedModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className="locked-content-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-icon" aria-hidden="true">⚠️</div>
                        <h3 id="modal-title">เนื้อหายังไม่พร้อมใช้งาน</h3>
                        <button 
                            className="close-btn" 
                            onClick={handleCloseLockedModal}
                            aria-label="ปิดหน้าต่าง"
                            tabIndex={1}
                        >
                            ✕
                        </button>
                    </div>
                    
                    <div className="modal-content" id="modal-description">
                        {/* Compact Info Section */}
                        <div className="compact-info">
                            <div className="info-row">
                                <span className="info-label">📖 บทเรียน:</span>
                                <span className="info-value">{lockedContentData.sectionTitle}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">📝 แบบทดสอบ:</span>
                                <span className="info-value">{lockedContentData.quizTitle}</span>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="progress-section">
                            <div className="progress-header">
                                <span className="progress-title">📹 ความคืบหน้า ({lockedContentData.totalVideos} วิดีโอ)</span>
                            </div>
                            <div className="progress-stats">
                                <div className="stat completed">
                                    <span className="stat-icon">✅</span>
                                    <span className="stat-text">จบแล้ว {lockedContentData.completedVideos}</span>
                                </div>
                                <div className="stat incomplete">
                                    <span className="stat-icon">⏳</span>
                                    <span className="stat-text">ยังไม่จบ {lockedContentData.totalVideos - lockedContentData.completedVideos}</span>
                                </div>
                            </div>
                        </div>

                        {/* Videos List */}
                        {lockedContentData.incompleteVideos && lockedContentData.incompleteVideos.length > 0 && (
                            <div className="videos-section">
                                <div className="videos-header">
                                    <span className="videos-title">📋 วิดีโอที่ต้องเรียนให้จบ</span>
                                </div>
                                <div className="videos-list">
                                    {lockedContentData.incompleteVideos.map((video: any, index: number) => (
                                        <div key={index} className="video-item">
                                            <span className="video-number">{index + 1}.</span>
                                            <span className="video-title">{video.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Requirements List */}
                        {lockedContentData.requirements && lockedContentData.requirements.length > 0 && (
                            <div className="requirements-section">
                                <div className="requirements-header">
                                    <span className="requirements-title">📋 เงื่อนไขที่ต้องทำ</span>
                                </div>
                                <div className="requirements-list">
                                    {lockedContentData.requirements.map((requirement: string, index: number) => (
                                        <div key={index} className="requirement-item">
                                            <span className="requirement-number">{index + 1}.</span>
                                            <span className="requirement-text">{requirement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        <div className="message-section">
                            <span className="message-icon">💡</span>
                            <span className="message-text">
                                {lockedContentData.requirements && lockedContentData.requirements.length > 0 
                                    ? "กรุณาทำตามเงื่อนไขข้างต้นก่อนทำแบบทดสอบ"
                                    : "กรุณาเรียนวิดีโอให้จบก่อนทำแบบทดสอบท้ายบท"
                                }
                            </span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button 
                            className="btn-understand" 
                            onClick={handleCloseLockedModal}
                            tabIndex={2}
                            autoFocus
                        >
                            เข้าใจแล้ว
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
export default LessonArea;
