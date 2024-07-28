'use client'

import React, { useState, useRef } from 'react'
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
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
    <div className="container mx-auto p-12">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Maan-Naa
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        We recommend appropriate outfit for your meetup.
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-4 mb-4">
          <Label htmlFor="image">Image of your own</Label>
          <Input type="file" id="image" onChange={handleFileChange} accept="image/*" required className="w-[300px]" />
        </div>
        <div className="mb-4">
          <Select onValueChange={setCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Korea">Korea</SelectItem>
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
              <SelectItem value="blind date">blind date</SelectItem>
              <SelectItem value="first date">first date</SelectItem>
              <SelectItem value="travel">travel</SelectItem>
              <SelectItem value="wedding propose">wedding propose</SelectItem>
              <SelectItem value="wedding ceremony">wedding ceremony</SelectItem>
              <SelectItem value="funeral">funeral</SelectItem>
              <SelectItem value="bridal shower">bridal shower</SelectItem>
              <SelectItem value="baby shower">baby shower</SelectItem>
              <SelectItem value="retirement">retirement</SelectItem>
              <SelectItem value="first day at school">first day at school</SelectItem>
              <SelectItem value="first day at work">first day at work</SelectItem>
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
    </div>
  )
}
