import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
import formidable from 'formidable'
import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'

export const config = {
  api: {
    bodyParser: false,
  },
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const form = formidable({})

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' })
    }

    const imageFile = files.image?.[0]
    const country = fields.country?.[0]
    const place = fields.place?.[0]
    const giftRequired = fields.giftRequired?.[0] === 'true'
    const furtherInfo = fields.furtherInfo

    if (!imageFile || !country || !place) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const imageBuffer = fs.readFileSync(imageFile.filepath)
      const processedImageBuffer = await sharp(imageBuffer)
        .resize(512, 512)
        .jpeg()
        .toBuffer()

      const tempFilePath = path.join(os.tmpdir(), `image_${Date.now()}.jpg`)
      fs.writeFileSync(tempFilePath, processedImageBuffer)

      const filePart = {
        inlineData: {
          data: Buffer.from(fs.readFileSync(tempFilePath)).toString("base64"),
          mimeType: "image/jpeg"
        },
      }

      const prompt = `You are going to pretend to be a senior editor at elle fashion magazine. You must analyze the outfit in the image for a ${place} in ${country} by adding all the information necessary.
### Instruction ###
1. Is the outfit appropriate for the event? Why or why not? If not, suggest the best style in detail.
2. What are important etiquette rules to follow for this event in ${country}?
3. What preparations are typically expected for this event in ${country}?
${giftRequired ? `4. What kind of gifts should I bring for this event in ${country}?` : ''}
${furtherInfo ? `5. ${furtherInfo}` : ''}

Please provide a detailed response covering all these aspects.

### Response Format ###
{ "appropriateness": "", "etiquette" : "", "preparations": "", "gift": "" }
          `

      console.log(prompt);

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      })

      const result = await model.generateContent([prompt, filePart])
      const response = await result.response
      const text = response.text()

      console.log(text);

      fs.unlinkSync(tempFilePath)

      res.status(200).json(JSON.parse(text));

    } catch (error) {
      console.error("Error analyzing outfit:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  })
}