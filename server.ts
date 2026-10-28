import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health & Config status
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
    teacher: 'Diêm Nhật Minh',
    school: 'Tiểu học Kim Đồng',
    address: '207 Nguyễn Trung Trực, phường Rạch Giá, tỉnh An Giang',
    phone: '0917014180',
    class: '5/3',
    academicYear: '2026-2027',
    model: 'gemini-3.8-flash',
  });
});

// 2. AI Exercise Generator (Xưởng bài tập AI)
app.post('/api/ai/generate-exercise', async (req: Request, res: Response) => {
  try {
    const { subject, topic, objective, level, count = 3, questionType = 'multiple_choice' } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Chưa cấu hình API Key cho Gemini AI',
        message: 'Trợ lý AI chưa được kích hoạt với khóa API máy chủ. Vui lòng sử dụng ngân hàng học liệu mẫu đã được kiểm duyệt hoặc cấu hình GEMINI_API_KEY.',
      });
    }

    const prompt = `Bạn là chuyên gia giáo dục tiểu học Việt Nam phụ trách Chương trình GDPT 2018 lớp 5.
Hãy thiết kế bộ bài tập phân hóa theo thông số sau:
- Môn học: ${subject || 'Toán'}
- Tên bài / Chủ đề: ${topic || 'Phép cộng số thập phân'}
- Yêu cầu cần đạt (YCCĐ): ${objective || 'Thực hiện được phép cộng hai số thập phân; giải quyết được bài toán thực tế.'}
- Mức độ: ${level || 'Mức 2 (Thông hiểu/Vận dụng)'}
- Số lượng câu hỏi: ${count}
- Dạng câu hỏi: ${questionType}

YÊU CẦU ĐẶC BIỆT:
1. Nội dung trong sáng, gần gũi với học sinh lớp 5 (10-11 tuổi), phong cách sư phạm chuẩn mực Việt Nam.
2. Kiểm tra tính chính xác tuyệt đối của phép tính và logic câu hỏi.
3. Cung cấp đáp án đúng, các phương án nhiễu hợp lý (phản ánh lỗi thường gặp của học sinh) và lời giải thích sư phạm chi tiết từng bước.
4. Gắn rõ từng câu với yêu cầu cần đạt (YCCĐ) cụ thể.

Trả về kết quả ở định dạng JSON chính xác:
[
  {
    "id": "q1",
    "question": "Nội dung câu hỏi...",
    "type": "multiple_choice | short_answer | true_false | word_problem",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A",
    "explanation": "Hướng dẫn giải chi tiết từng bước...",
    "objective": "Yêu cầu cần đạt cụ thể...",
    "difficulty": "Khởi động | Tăng tốc | Chinh phục"
  }
]`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              type: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              objective: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
            required: ['id', 'question', 'correctAnswer', 'explanation', 'objective'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);
    return res.json({ success: true, questions: parsed });
  } catch (error: any) {
    console.warn('AI service temporarily busy, providing Grade 5 GDPT 2018 fallback:', error?.message);
    const { subject, topic, level } = req.body;
    return res.json({
      success: true,
      fallback: true,
      questions: [
        {
          id: `q-p5-fb-1`,
          question: `[${subject || 'Toán'} - ${level || 'Mức 2'}] Đặt tính rồi tính kết quả của biểu thức: 27,5 + 3,84 = ?`,
          type: 'multiple_choice',
          options: ['A. 30,34', 'B. 31,34', 'C. 65,9', 'D. 31,89'],
          correctAnswer: 'B',
          explanation: 'Đặt tính sao cho các chữ số ở cùng một hàng và dấu phẩy thẳng cột với nhau: 27,50 + 03,84 = 31,34.',
          objective: 'YCCĐ-T5.01: Thực hiện được phép cộng hai số thập phân thẳng cột.',
          difficulty: level || 'Khởi động',
        },
        {
          id: `q-p5-fb-2`,
          question: `[${subject || 'Toán'} - ${level || 'Mức 2'}] Tính bằng cách thuận tiện nhất: 14,25 + 7,89 + 5,75`,
          type: 'multiple_choice',
          options: ['A. 27,89', 'B. 28,89', 'C. 26,89', 'D. 25,75'],
          correctAnswer: 'A',
          explanation: 'Vận dụng tính chất giao hoán và kết hợp: (14,25 + 5,75) + 7,89 = 20 + 7,89 = 27,89.',
          objective: 'YCCĐ-T5.02: Vận dụng tính chất giao hoán và kết hợp của phép cộng số thập phân.',
          difficulty: level || 'Tăng tốc',
        },
      ],
    });
  }
});

// 3. AI Assessment Analysis & Personalized Path Recommendation
app.post('/api/ai/analyze-assessment', async (req: Request, res: Response) => {
  try {
    const { studentName, studentCode, topic, testResults } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Chưa cấu hình API Key cho Gemini AI',
        message: 'Hệ thống sẽ chuyển sang động cơ phân tích quy tắc sư phạm GDPT 2018 tích hợp.',
      });
    }

    const prompt = `Bạn là chuyên gia khảo sát năng lực học sinh tiểu học theo chương trình GDPT 2018 Việt Nam.
Hãy phân tích kết quả làm bài của học sinh để đề xuất lộ trình học tập cá nhân hóa.
LƯU Ý BẢO MẬT: Chỉ sử dụng mã học sinh: "${studentCode || 'HS-01'}" và tên: "${studentName || 'Học sinh'}".
Chủ đề: ${topic || 'Phép cộng số thập phân'}
Dữ liệu làm bài: ${JSON.stringify(testResults || [])}

Yêu cầu phân tích:
1. Đánh giá mức độ đạt được theo từng Yêu cầu Cần Đạt (YCCĐ).
2. Phát hiện lỗi nhận thức / sai sót điển hình (ví dụ: đặt sai dấu phẩy, cộng quên nhớ, nhầm hàng số thập phân).
3. KHÔNG dán nhãn cố định học sinh là 'kém' hay 'yếu', dùng ngôn từ khích lệ, hướng tới sự tiến bộ.
4. Đề xuất CHÍNH XÁC MỘT trong 3 lộ trình:
   - "KHỞI ĐỘNG": Củng cố lại kiến thức nền, trực quan hoá các bước tính, bài tập cơ bản có giàn giáo.
   - "TĂNG TỐC": Rèn luyện kỹ năng tính toán, giải bài toán có lời văn 1-2 bước, tình huống thực tế.
   - "CHINH PHỤC": Vận dụng toán học giải quyết vấn đề phức hợp, giải thích lập luận, nhiệm vụ sáng tạo.
5. Gợi ý 2-3 nhiệm vụ tiếp theo cụ thể.

Trả về JSON với cấu trúc:
{
  "recommendedPath": "KHỞI ĐỘNG | TĂNG TỐC | CHINH PHỤC",
  "pathReason": "Giải thích sư phạm vì sao chọn lộ trình này...",
  "masteryRate": 75,
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "challenges": ["Khó khăn phát hiện 1", "Khó khăn 2"],
  "actionPlan": ["Bước 1...", "Bước 2..."],
  "encouragement": "Lời động viên ấm áp dành cho học sinh..."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing assessment:', error);
    return res.status(500).json({
      error: 'Không thể phân tích bằng AI',
      details: error?.message,
    });
  }
});

// 4. "Bạn La Bàn AI" Educational Student Chatbot
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, studentContext } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Chưa cấu hình API Key cho Gemini AI',
        message: 'Trợ lý La Bàn AI chưa được kết nối máy chủ. Thầy cô hoặc quản trị viên cần cung cấp GEMINI_API_KEY.',
      });
    }

    const systemInstruction = `Bạn là "BẠN LA BÀN AI" - Trợ lý học tập thông minh, thân thiện của Lớp 5/3, Trường Tiểu học Kim Đồng (GVCN: Thầy Diêm Nhật Minh).
Tính cách:
- Biểu tượng là chiếc la bàn hoạt hình vui vẻ, cầm bút chì hoặc kính lúp nhỏ.
- Ngôn ngữ: 100% tiếng Việt chuẩn mực, xưng "Bạn La Bàn", gọi học sinh là "bạn" hoặc "em".
- Nhiệt tình, ấm áp, kiên nhẫn, luôn động viên sự cố gắng của học sinh.

QUY TẮC SƯ PHẠM VÀ AN TOÀN TRẺ EM BẮT BUỘC:
1. TUYỆT ĐỐI KHÔNG làm hộ bài tập hoặc đọc ngay đáp án cuối cùng.
2. LUÔN dùng phương pháp gợi mở từng bước (Socratic method):
   - Đặt câu hỏi nhỏ dẫn dắt học sinh tự tìm ra cách giải.
   - Nhắc lại quy tắc cốt lõi (ví dụ: "Khi đặt tính cộng số thập phân, chúng mình cần chú ý dấu phẩy thẳng cột với nhau nhé!").
3. Khi học sinh trả lời chưa đúng, nhẹ nhàng chỉ ra điểm cần xem lại mà không chê bai.
4. Chỉ trao đổi kiến thức học tập lớp 5 (Toán, Tiếng Việt, Khoa học, Lịch sử & Địa lí, Đạo đức, Tin học, Công nghệ).
5. Tuyệt đối không hỏi hay lưu trữ thông tin cá nhân nhạy cảm của học sinh.
6. Khi học sinh gặp câu hỏi quá khó hoặc bối rối, khuyên học sinh hỏi thêm thầy Diêm Nhật Minh.`;

    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }],
    }));

    if (formattedContents.length === 0) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: 'Xin chào Bạn La Bàn AI!' }],
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'Xin chào bạn! Hãy chia sẻ câu hỏi hoặc bài tập bạn muốn chúng mình cùng khám phá nhé!';
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.warn('AI chat error, using Socratic response:', error?.message);
    return res.json({
      success: true,
      fallback: true,
      reply: 'Chào bạn! Khi gặp bài toán số thập phân, bạn hãy nhớ viết số hạng này dưới số hạng kia sao cho dấu phẩy và các chữ số cùng hàng thẳng cột với nhau nhé! Bạn hãy thử kiểm tra lại phép tính của mình xem đã thẳng hàng chưa nào?',
    });
  }
});

// 5. AI Teacher Insights for Class Dashboard
app.post('/api/ai/teacher-insights', async (req: Request, res: Response) => {
  try {
    const { classData, topic } = req.body;

    if (!aiClient) {
      return res.status(503).json({
        error: 'Chưa cấu hình API Key',
        message: 'Chưa đủ dữ liệu hoặc chưa kết nối AI.',
      });
    }

    const prompt = `Bạn là cố vấn sư phạm AI hỗ trợ Thầy Diêm Nhật Minh - GVCN Lớp 5/3 Trường Tiểu học Kim Đồng.
Dựa trên số liệu thực tế của lớp học:
Chủ đề: ${topic || 'Toán học lớp 5'}
Số liệu lớp: ${JSON.stringify(classData)}

Hãy phân tích và đưa ra 3 khuyến nghị sư phạm ngắn gọn, thiết thực nhất:
1. Nhận xét về kỹ năng học sinh thực hiện tốt nhất.
2. Chỉ ra rào cản/lỗi phổ biến nhất mà nhóm học sinh đang gặp.
3. Đề xuất hoạt động dạy học phân hóa tiếp theo (ví dụ: củng cố trực quan bằng bảng con, phân nhóm học tập, hay giao bài Chinh phục).

YÊU CẦU: Dựa CHÍNH XÁC vào dữ liệu cung cấp, không bịa đặt số liệu thống kê. Định dạng JSON:
{
  "summary": "Tóm tắt ngắn gọn...",
  "keyStrengths": ["..."],
  "commonPitfalls": ["..."],
  "pedagogicalAdvice": ["Khuyến nghị 1", "Khuyến nghị 2", "Khuyến nghị 3"]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, insights: parsed });
  } catch (error: any) {
    console.error('Error generating teacher insights:', error);
    return res.status(500).json({ error: 'Lỗi phân tích', details: error?.message });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI LA BAN 5/3] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
