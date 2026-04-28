import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorProfile = () => {

 const {dToken, profileData, getProfileData, updateProfileData} = useContext(DoctorContext)

 const [isEdit, setIsEdit] = useState(false)
 const [formData, setFormData] = useState({
  availability: false,
  fees: '',
  addressLine1: '',
  addressLine2: ''
 })

 useEffect(()=>{
    if(dToken){
        getProfileData()
    }
  },[dToken])

  useEffect(() => {
    if(profileData){
      setFormData({
        availability: !!profileData.availability,
        fees: profileData.fees ?? '',
        addressLine1: profileData.address?.line1 ?? '',
        addressLine2: profileData.address?.line2 ?? ''
      })
    }
  }, [profileData])

  const handleChange = (event) => {
    const {name, type, checked, value} = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    const payload = {
      fees: Number(formData.fees),
      availability: formData.availability,
      address: {
        line1: formData.addressLine1,
        line2: formData.addressLine2
      }
    }

    await updateProfileData(payload)
    setIsEdit(false)
  }

  if (!profileData) {
    return (
      <div className='m-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
        <p className='text-sm font-medium text-slate-500'>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]'>
        <div className='h-28 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 sm:h-36' />

        <div className='px-5 pb-6 sm:px-8 sm:pb-8'>
          <div className='-mt-12 flex flex-col gap-6 sm:-mt-14 lg:flex-row lg:items-end lg:justify-between'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
              <div className='relative'>
                <img
                  className='h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32'
                  src={profileData.image || assets.doctor_icon}
                  alt={profileData.name}
                />
                <span className={`absolute -right-2 bottom-2 rounded-full px-3 py-1 text-xs font-semibold shadow ${profileData.availability ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {profileData.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className='pb-1'>
                <p className='text-3xl font-semibold tracking-tight text-slate-900'>
                  {profileData.name}
                </p>
                <p className='mt-1 text-sm font-medium uppercase tracking-[0.2em] text-sky-600'>
                  {profileData.degree} • {profileData.speciality}
                </p>
              </div>
            </div>

            {!isEdit ? (
              <button
                onClick={() => setIsEdit(true)}
                className='inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className='inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700'
              >
                Save
              </button>
            )}
          </div>

          <div className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Experience</p>
              <p className='mt-2 text-lg font-semibold text-slate-900'>{profileData.experience}</p>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Consultation Fee</p>
              {isEdit ? (
                <input
                  type='number'
                  name='fees'
                  value={formData.fees}
                  onChange={handleChange}
                  className='mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-lg font-semibold text-slate-900 outline-none ring-0 focus:border-sky-500'
                />
              ) : (
                <p className='mt-2 text-lg font-semibold text-slate-900'>₹ {profileData.fees}</p>
              )}
            </div>

            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Status</p>
              {isEdit ? (
                <label className='mt-3 flex items-center gap-3 text-sm font-medium text-slate-700'>
                  <input
                    type='checkbox'
                    name='availability'
                    checked={formData.availability}
                    onChange={handleChange}
                    className='h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500'
                  />
                  Available for appointments
                </label>
              ) : (
                <p className='mt-2 text-lg font-semibold text-slate-900'>
                  {profileData.availability ? 'Online for appointments' : 'Currently offline'}
                </p>
              )}
            </div>

            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Speciality</p>
              <p className='mt-2 text-lg font-semibold text-slate-900'>{profileData.speciality}</p>
            </div>
          </div>

          <div className='mt-8 grid gap-5 lg:grid-cols-2'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5'>
              <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-400'>About</p>
              <p className='mt-3 text-sm leading-7 text-slate-600'>{profileData.about}</p>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-white p-5'>
              <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-400'>Address</p>
              {isEdit ? (
                <div className='mt-3 space-y-3'>
                  <input
                    type='text'
                    name='addressLine1'
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder='Address line 1'
                    className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500'
                  />
                  <input
                    type='text'
                    name='addressLine2'
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder='Address line 2'
                    className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500'
                  />
                </div>
              ) : (
                <div className='mt-3 space-y-2 text-sm leading-6 text-slate-600'>
                  <p>{profileData.address?.line1}</p>
                  <p>{profileData.address?.line2}</p>
                </div>
              )}
            </div>
          </div>

          <div className='mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm font-semibold text-slate-900'>Profile details</p>
                <p className='mt-1 text-sm text-slate-500'>Doctor panel identity and account information</p>
              </div>
              <div className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200'>
                <span className={`h-2.5 w-2.5 rounded-full ${profileData.availability ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {profileData.availability ? 'Available for booking' : 'Not available for booking'}
              </div>
            </div>

            <div className='mt-4 grid gap-3 sm:grid-cols-2'>
              <div className='rounded-xl bg-white p-4 ring-1 ring-slate-200'>
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Email</p>
                <p className='mt-2 text-sm font-medium text-slate-900'>{profileData.email}</p>
              </div>
              <div className='rounded-xl bg-white p-4 ring-1 ring-slate-200'>
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>Degree</p>
                <p className='mt-2 text-sm font-medium text-slate-900'>{profileData.degree}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile