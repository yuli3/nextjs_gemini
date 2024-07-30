'use client'

import React, { useState, useRef, useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface AnalysisResult {
  appropriateness: string
  colormatching: string
  preparations: string
  etiquette: string
  gift: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [country, setCountry] = useState('')
  const [place, setPlace] = useState('')
  const [giftRequired, setGiftRequired] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [furtherInfo, setFurtherInfo] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // Clean up the object URL when component unmounts or when a new file is selected
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      
      // Create a preview URL for the selected file
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreviewUrl(objectUrl)
    }
  }

  const handleFurtherInfo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setFurtherInfo(event.target.value)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file || !country || !place) return

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('country', country)
    formData.append('place', place)
    formData.append('giftRequired', giftRequired.toString())
    formData.append('furtherInfo', furtherInfo)

    try {
      const response = await fetch('/api/analyze-outfit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while analyzing the outfit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-12">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Maan-Naa
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        We recommend appropriate outfit for your meetup.
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-4 mb-4 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="image">Image of your own</Label>
          <Input type="file" id="image" onChange={handleFileChange} accept="image/*" required className="w-[300px]" ref={fileInputRef} />
          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="Preview" className="max-w-[300px] max-h-[300px] object-contain" />
            </div>
          )}
        </div>
        <div className="mb-4">
          <Select onValueChange={setCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="England">England</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Greece">Greece</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Italy">Italy</SelectItem>
              <SelectItem value="Korea">Korea</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
              <SelectItem value="Sweden">Sweden</SelectItem>
              <SelectItem value="Ukraine">Ukraine</SelectItem>
              <SelectItem value="USA">USA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Select onValueChange={setPlace}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="place" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job interview">job interview</SelectItem>
              <SelectItem value="first date">first date</SelectItem>
              <SelectItem value="trip">trip</SelectItem>
              <SelectItem value="wedding propose">wedding propose</SelectItem>
              <SelectItem value="wedding ceremony">wedding ceremony</SelectItem>
              <SelectItem value="funeral">funeral</SelectItem>
              <SelectItem value="bridal shower">bridal shower</SelectItem>
              <SelectItem value="baby shower">baby shower</SelectItem>
              <SelectItem value="retirement">retirement</SelectItem>
              <SelectItem value="first day at school">first day at school</SelectItem>
              <SelectItem value="first day at work">first day at work</SelectItem>
              <SelectItem value="presentation at work">presentation at work</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <Checkbox
            id="giftRequired"
            checked={giftRequired}
            onCheckedChange={(checked) => setGiftRequired(checked as boolean)}
          />
          <Label htmlFor="giftRequired">Gift or preparation required?</Label>
        </div>
        <div className="mb-4">
          <Label htmlFor="furtherInfo">Type in any further information</Label>
          <Input
            type="text"
            id="furtherInfo"
            placeholder="further information.."
            onChange={handleFurtherInfo}
          />
        </div>
        <Button type="submit" disabled={!file || !country || !place || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Analyze Outfit
        </Button>
      </form>

      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle><strong>Analysis Result</strong></CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Appropriateness</strong> : <br /> {result.appropriateness}</p>
            <br />
            <p><strong>Color Matching</strong> : <br /> {result.colormatching}</p>
            <br />
            <p><strong>Etiquette</strong> : <br /> {result.etiquette}</p>
            <br />
            <p><strong>Preparations</strong> : <br /> {result.preparations}</p>
            <br />
            <p><strong>Gifts</strong> :<br />
            {result.gift &&
               (`${result.gift}`)
              }
            </p>
          </CardContent>
        </Card>
      )}
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        Powered By <Link href="https://aistudio.google.com/"><strong>Gemini</strong></Link>
        <br />
        유튜버 <Link href="https://www.youtube.com/live/ltm6r3dZ4Ag?si=ngFX3s7G9CFB4q7m"><strong>조코딩</strong></Link>님의 도움으로 제작했습니다.
        <br />
        <br />
        <br />
        <div className="a2a_kit a2a_kit_size_32 a2a_default_style">
            <a className="a2a_dd" href="https://www.addtoany.com/share"></a>
            <a className="a2a_button_facebook"></a>
            <a className="a2a_button_mastodon"></a>
            <a className="a2a_button_email"></a>
            <a className="a2a_button_linkedin"></a>
            <a className="a2a_button_telegram"></a>
            <a className="a2a_button_whatsapp"></a>
            <a className="a2a_button_sms"></a>
            <a className="a2a_button_hacker_news"></a>
            <a className="a2a_button_kakao"></a>
            <a className="a2a_button_line"></a>
            <a className="a2a_button_x"></a>
            <a className="a2a_button_snapchat"></a>
          </div>
      </blockquote>
      <Script src="https://static.addtoany.com/menu/page.js" strategy="lazyOnload" />
    </main>
  )
}
