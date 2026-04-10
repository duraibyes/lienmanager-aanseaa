import { Brain, Calculator, CheckSquare, Clock, FolderOpen, FolderPlus, Home, Sparkles, Users } from "lucide-react";

export  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { id: 'home', label: 'Home', icon: Home, path: '/dashboard' }
      ]
    },
    {
      title: 'Projects',
      items: [
        { id: 'new_projects', label: 'New Project', icon: FolderPlus, path: '/project/create' },
        { id: 'recent_projects', label: 'Recent Projects', icon: FolderOpen, path: '/projects' }
      ]
    },
    {
      title: 'Contacts',
      items: [
        { id: 'recent_contacts', label: 'Recent Contacts', icon: Users, path: '/contacts' }
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'deadlines', label: 'Deadlines', icon: Clock, path: '/deadlines' },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' }
      ]
    },
    {
      title: 'Tools',
      items: [
        { id: 'quick_remedies', label: 'Quick Remedies', icon: Calculator, path: '/quick-remedies' }
      ]
    },
    {
      title: 'Analytics',
      items: [
        { id: 'ai_insights', label: 'AI Insights', icon: Brain, path: '/' }
      ]
    },
    {
      title: 'Help',
      items: [
        { id: 'onboarding_demo', label: 'Tour Demo', icon: Sparkles, path: '/tour' }
      ]
    }
  ];
  