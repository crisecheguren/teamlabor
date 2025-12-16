import { GET } from '../route'
import { NextRequest } from 'next/server'

// Mock fetch globally
global.fetch = jest.fn()

describe('/api/representatives', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Valid address lookup', () => {
    it('should return representatives for a valid address with regular district', async () => {
      // Mock Census API response for a regular district
      const mockCensusResponse = {
        result: {
          addressMatches: [
            {
              matchedAddress: '1600 PENNSYLVANIA AVE NW, WASHINGTON, DC, 20500',
              geographies: {
                '119th Congressional Districts': [
                  {
                    GEOID: '1100', // DC At-Large
                    NAME: 'Congressional District (at Large)',
                  },
                ],
              },
            },
          ],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=1600+Pennsylvania+Ave+NW,+Washington,+DC')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.address.matched).toBe('1600 PENNSYLVANIA AVE NW, WASHINGTON, DC, 20500')
      expect(data.address.input).toBe('1600 Pennsylvania Ave NW, Washington, DC')
      expect(data.district.state).toBe('District of Columbia')
      expect(data.district.stateAbbr).toBe('DC')
      expect(data.district.districtNumber).toBe('At-Large')
      expect(data.district.districtName).toBe('District of Columbia At-Large')
      expect(data.district.chamber).toBe('House')
      expect(data.senators.state).toBe('District of Columbia')
      expect(data.senators.stateAbbr).toBe('DC')
    })

    it('should return representatives for a numbered district (non at-large)', async () => {
      const mockCensusResponse = {
        result: {
          addressMatches: [
            {
              matchedAddress: '123 MAIN ST, SAN FRANCISCO, CA, 94102',
              geographies: {
                '119th Congressional Districts': [
                  {
                    GEOID: '0611', // California District 11
                    NAME: 'Congressional District 11',
                  },
                ],
              },
            },
          ],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=123+Main+St,+San+Francisco,+CA')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.district.state).toBe('California')
      expect(data.district.stateAbbr).toBe('CA')
      expect(data.district.districtNumber).toBe('11')
      expect(data.district.districtName).toBe('California District 11')
      expect(data.district.chamber).toBe('House')
    })

    it('should handle fallback to "Congressional Districts" when 119th not available', async () => {
      const mockCensusResponse = {
        result: {
          addressMatches: [
            {
              matchedAddress: '789 ELM ST, AUSTIN, TX, 78701',
              geographies: {
                'Congressional Districts': [ // Fallback key
                  {
                    GEOID: '4825', // Texas District 25
                    NAME: 'Congressional District 25',
                  },
                ],
              },
            },
          ],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=789+Elm+St,+Austin,+TX')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.district.state).toBe('Texas')
      expect(data.district.stateAbbr).toBe('TX')
      expect(data.district.districtNumber).toBe('25')
      expect(data.district.districtName).toBe('Texas District 25')
    })
  })

  describe('Error handling', () => {
    it('should return 400 if address parameter is missing', async () => {
      const url = new URL('http://localhost:3000/api/representatives')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Address is required')
    })

    it('should return error if Census API returns no address matches', async () => {
      const mockCensusResponse = {
        result: {
          addressMatches: [],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=invalid+address+xyz')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Could not find that address. Please check the address and try again.')
    })

    it('should return error if Census API returns no congressional district data', async () => {
      const mockCensusResponse = {
        result: {
          addressMatches: [
            {
              matchedAddress: '123 MAIN ST',
              geographies: {}, // No congressional district data
            },
          ],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=123+Main+St')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Could not determine congressional district for this address.')
    })

    it('should return 500 if Census API call fails', async () => {
      ;(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=123+Main+St')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to look up address. Please try again later.')
    })

    it('should return 500 if Census API throws an exception', async () => {
      ;(global.fetch).mockRejectedValueOnce(new Error('Network error'))

      const url = new URL('http://localhost:3000/api/representatives?address=123+Main+St')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to look up address. Please try again later.')
    })
  })

  describe('Edge cases', () => {
    it('should correctly handle at-large districts (district number "00")', async () => {
      const mockCensusResponse = {
        result: {
          addressMatches: [
            {
              matchedAddress: '100 MAIN ST, CHEYENNE, WY, 82001',
              geographies: {
                '119th Congressional Districts': [
                  {
                    GEOID: '5600', // Wyoming At-Large (FIPS 56 = WY, district 00)
                    NAME: 'Congressional District (at Large)',
                  },
                ],
              },
            },
          ],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=100+Main+St,+Cheyenne,+WY')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.district.state).toBe('Wyoming')
      expect(data.district.stateAbbr).toBe('WY')
      expect(data.district.districtNumber).toBe('At-Large')
      expect(data.district.districtName).toBe('Wyoming At-Large')
    })

    it('should handle unknown FIPS codes gracefully', async () => {
      const mockCensusResponse = {
        result: {
          addressMatches: [
            {
              matchedAddress: 'UNKNOWN LOCATION',
              geographies: {
                '119th Congressional Districts': [
                  {
                    GEOID: '9901', // Invalid FIPS code
                    NAME: 'Unknown District',
                  },
                ],
              },
            },
          ],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=unknown')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.district.state).toBe('Unknown')
      expect(data.district.stateAbbr).toBe('Unknown')
      expect(data.district.districtNumber).toBe('1')
    })

    it('should handle districts with leading zeros correctly', async () => {
      const mockCensusResponse = {
        result: {
          addressMatches: [
            {
              matchedAddress: '456 OAK ST, MONTGOMERY, AL, 36104',
              geographies: {
                '119th Congressional Districts': [
                  {
                    GEOID: '0102', // Alabama District 2 (with leading zero)
                    NAME: 'Congressional District 2',
                  },
                ],
              },
            },
          ],
        },
      }

      ;(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCensusResponse,
      })

      const url = new URL('http://localhost:3000/api/representatives?address=456+Oak+St,+Montgomery,+AL')
      const request = new NextRequest(url)
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.district.state).toBe('Alabama')
      expect(data.district.stateAbbr).toBe('AL')
      expect(data.district.districtNumber).toBe('2') // Should strip leading zero
      expect(data.district.districtName).toBe('Alabama District 2')
    })
  })

  describe('FIPS code mapping', () => {
    it('should correctly map all common state FIPS codes', async () => {
      const testCases = [
        { fips: '01', state: 'Alabama', abbr: 'AL' },
        { fips: '06', state: 'California', abbr: 'CA' },
        { fips: '12', state: 'Florida', abbr: 'FL' },
        { fips: '36', state: 'New York', abbr: 'NY' },
        { fips: '48', state: 'Texas', abbr: 'TX' },
      ]

      for (const testCase of testCases) {
        const mockCensusResponse = {
          result: {
            addressMatches: [
              {
                matchedAddress: 'TEST ADDRESS',
                geographies: {
                  '119th Congressional Districts': [
                    {
                      GEOID: `${testCase.fips}01`,
                      NAME: 'Congressional District 1',
                    },
                  ],
                },
              },
            ],
          },
        }

        ;(global.fetch).mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockCensusResponse,
        })

        const url = new URL(`http://localhost:3000/api/representatives?address=test`)
        const request = new NextRequest(url)
        const response = await GET(request)
        const data = await response.json()

        expect(data.success).toBe(true)
        expect(data.district.state).toBe(testCase.state)
        expect(data.district.stateAbbr).toBe(testCase.abbr)
      }
    })
  })
})
