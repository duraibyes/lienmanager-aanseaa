import { Building2, Camera, Edit3, Globe, Lock, Mail, MapPin, Phone, Save, Scale, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/lienAuth/profileApi";
import { PageContainer, PageHeader } from "../layout/page-wrapper";
import { PageSubtitle, PageTitle } from "../ui/typography";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ProfileAdd } from "@/types/customer";
import { useGetStatesQuery } from "@/features/master/masterDataApi";
import Swal from "sweetalert2";
import ChangeProfilePassword from "./ChangeProfilePassword";

const MemberProfile = () => {

  const { data, isFetching, refetch } = useGetProfileQuery();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState<ProfileAdd>({
    companyId: 0,
    newCompanyName: '',
    fax: '',
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    stateId: 0,
    zip: '',
    profileImage: null,
    website: '',
  });

  const profile = data?.data || null;
  const country_id = 1;

  const { data: states, isLoading: isStatesLoading, isFetching: isStatesFetching } = useGetStatesQuery(
    { country_id: Number(country_id) },
    { skip: !country_id }
  );

  const [updateProfile] = useUpdateProfileMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 2 * 1024 * 1024;

    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!validTypes.includes(file.type)) {

      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a valid image file (JPEG, JPG, or PNG)",
      });

      e.target.value = "";

      setProfileImage(null);

      return;
    }
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image must be less than 2MB",
      });

      e.target.value = "";
      setProfileImage(null);
      return;
    }

    setProfileImage(file);
  };

  const calculateCompletion = () => {
    const fields = [
      profile?.user_details?.first_name,
      profile?.user_details?.last_name,
      profile?.user_details?.phone,
      profile?.user?.email,
      profile?.company?.company,
      profile?.company?.website,
      profile?.user_details?.address,
      profile?.user_details?.city,
      profile?.user_details?.state,
      profile?.user_details?.zip_code,
      profile?.user_details?.country,
    ]
    const filled = fields.filter(f => f && f.trim() !== "").length
    return Math.round((filled / fields.length) * 100)
  }

  const profileCompletion = calculateCompletion();

  const updateForm = useCallback(
    (field: keyof ProfileAdd, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    if (!formData.stateId) {
      newErrors.stateId = "State is required";
    }

    if (!formData.zip) {
      newErrors.zip = "Zip is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = new FormData();
      if (formData.companyId) {
        payload.append("company_id", String(formData.companyId));
      }
      payload.append("company_name", formData.newCompanyName);
      payload.append("fax", formData.fax);
      payload.append("first_name", formData.firstName);
      payload.append("last_name", formData.lastName);
      payload.append("phone", formData.phone);
      payload.append("address", formData.address);
      payload.append("state_id", String(formData.stateId));
      payload.append("city", formData.city);
      payload.append("zip_code", formData.zip);
      payload.append("website", formData.website);

      if (profileImage) {
        payload.append("image", profileImage);
      }

      const res = await updateProfile(payload).unwrap();

      if (res.status) {
        await refetch();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsEditing(false);

      }

      setErrors({});
    } catch (err: any) {
      console.log('err', err);

      if (err?.data?.errors) {
        const apiErrors = err.data.errors;

        const formattedErrors: Record<string, string> = {};

        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = apiErrors[key][0];
        });

        setErrors(formattedErrors);
      } else {
        setErrors({
          general: err?.data?.message || "Something went wrong"
        });
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (profile) {
      setFormData({
        companyId: profile?.company?.id || 0,
        newCompanyName: profile?.company?.company || '',
        fax: profile?.company?.fax || '',
        firstName: profile.user_details?.first_name || '',
        lastName: profile.user_details?.last_name || '',
        email: profile.user.email || '',
        phone: profile.user_details?.phone || '',
        address: profile.user_details?.address || '',
        website: profile.company?.website || '',
        city: profile.user_details?.city || '',
        stateId: profile?.user_details?.state_id || 0,
        zip: profile.user_details?.zip_code || '',
        profileImage: null
      });
    }
  }, [profile]);

  if (isFetching) {
    return (
      <div className="p-4 pb-20 mx-auto max-w-(--breakpoint-2xl) md:p-6 md:pb-24">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">

        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">

          <div className="space-y-6">
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              Fetching Profile data.....
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return 'NA';

    return name
      .split(' ')
      .filter(Boolean) // remove empty spaces
      .map(word => word[0].toUpperCase())
      .join('');
  };

  return (
    <PageContainer className="">
      <PageHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <PageTitle>My Profile</PageTitle>
            <PageSubtitle className="mt-1">
              Manage your personal information and account security
            </PageSubtitle>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button className="gradient-primary hover:opacity-90" onClick={handleSubmit} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </PageHeader>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <Card className="card-elevated">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <Avatar className="h-32 w-32 mx-auto ring-4 ring-primary/10">
                  {profile?.user_details?.image ? (
                    <AvatarImage src={profile?.user_details?.image} alt="Profile" />
                  ) : (
                    <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                      {profile?.user_details?.first_name[0]}{profile?.user_details?.last_name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-10 h-10 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              <h3 className="text-xl font-semibold text-foreground mt-4">
                {profile?.user_details?.first_name} {profile?.user_details?.last_name}
              </h3>
              <p className="text-muted-foreground">{profile?.company?.company}</p>

              {/* Profile Completion */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-medium text-primary">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />

              </div>
            </CardContent>
          </Card>

          {/* Assigned Attorney Card */}
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Assigned Attorney
              </CardTitle>
            </CardHeader>
            <CardContent>
              {
                profile?.lienProvider && profile.lienProvider.map((lien, index) => (

                  <div className="flex items-center gap-3" key={index}>
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">{getInitials(lien.lien_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{lien.lien_name}</p>
                      {
                        lien.role_name &&

                        <p className="text-sm text-muted-foreground">{lien.role_name}</p>
                      }
                    </div>
                  </div>
                ))
              }
            </CardContent>
          </Card>

          {/* <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Last Login</span>
                </div>
                <span className="text-sm font-medium">Today, 9:42 AM</span>
              </div>
            </CardContent>
          </Card> */}
        </div>
        {/* right sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your personal details and contact information

                {errors.general && (
                  <div className="bg-red-100 text-red-600 p-2 rounded my-2">
                    {errors.general}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>First Name</FieldLabel>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Last Name</FieldLabel>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateForm('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </div>
                  </FieldLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    disabled={true}
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </div>
                  </FieldLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                      updateForm('phone', value)
                    }}
                    disabled={!isEditing}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Company Information Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>
              <CardDescription>
                Your company details and website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input
                    value={formData.newCompanyName}
                    // onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    disabled={!isEditing || formData.companyId !== 0}
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Company Website
                    </div>
                  </FieldLabel>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateForm('website', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Address Information Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address Information
              </CardTitle>
              <CardDescription>
                Your business address details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Street Address</FieldLabel>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    disabled={!isEditing}
                  />
                </Field>


                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>City</FieldLabel>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      disabled={!isEditing}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>State</FieldLabel>
                    {isEditing ? (
                      <select
                        value={formData.stateId}
                        onChange={(e) => updateForm('stateId', Number(e.target.value))}
                        className="w-full px-4 py-1.5 border border-slate-300 rounded focus:ring-4 focus:ring-primary/20 focus:border-primary"
                      >
                        {isStatesLoading || isStatesFetching ? (
                          <option value="">Loading states...</option>
                        ) : (
                          <>
                            <option value="">Select State</option>
                            {states?.data?.map((state) => (
                              <option key={state.id} value={state.id}>
                                {state.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    ) : (
                      <Input value={profile?.user_details?.state} disabled />
                    )}
                  </Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>ZIP Code</FieldLabel>
                    <Input
                      value={formData.zip}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        updateForm('zip', value);
                      }}
                      disabled={!isEditing}
                    />
                  </Field>
                  {/* <Field>
                    <FieldLabel>Country</FieldLabel>
                    <Input
                      value={profile.country}
                      disabled
                    />
                  </Field> */}
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChangeProfilePassword show={showPasswordForm} onClose={() => setShowPasswordForm(false)} />
    </PageContainer>
  );
};

export default MemberProfile;
