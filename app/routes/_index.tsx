import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b relative">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-2 text-xl font-bold text-primary">
            <span>🗣️</span>
            <span>Language Buddy</span>
          </div>
          <NavigationMenu className="ml-auto">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[280px] p-4">
                    <Card className="mb-3">
                      <CardHeader>
                        <CardTitle className="text-sm">Language Exchange</CardTitle>
                        <CardDescription className="text-xs">Connect with native speakers</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">AI Practice</CardTitle>
                        <CardDescription className="text-xs">Practice conversations with AI</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-24 text-center">
        <div className="text-6xl mb-4">🗣️</div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-500">
          Language Buddy
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground text-xl">
          Your AI-powered language learning companion. Practice conversations, connect with native speakers, and achieve fluency faster.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700">Start Learning</Button>
          <Button size="lg" variant="outline">Try Demo</Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🤖</span> AI Conversations
              </CardTitle>
              <CardDescription>
                Practice speaking with our AI language partners anytime, anywhere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Get instant feedback and corrections on your pronunciation and grammar.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>👥</span> Language Exchange
              </CardTitle>
              <CardDescription>
                Connect with native speakers worldwide.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Find language partners who speak your target language and want to learn your native language.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📚</span> Smart Learning
              </CardTitle>
              <CardDescription>
                Personalized learning path.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Our AI adapts to your learning style and pace to optimize your progress.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold tracking-tighter text-center">
          Common Questions
        </h2>
        <div className="mx-auto max-w-[800px]">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How does Language Buddy work?</AccordionTrigger>
              <AccordionContent>
                Language Buddy combines AI-powered conversation practice with real language exchange opportunities. Practice with our AI tutors anytime, and connect with native speakers when you're ready.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Which languages are supported?</AccordionTrigger>
              <AccordionContent>
                We currently support Spanish, French, German, Chinese, Japanese, and Korean, with more languages being added regularly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a free trial?</AccordionTrigger>
              <AccordionContent>
                Yes! You can try Language Buddy free for 14 days, including all premium features and AI conversation practice.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-violet-50">
        <div className="container px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Languages</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>About</li>
                <li>Blog</li>
                <li>Success Stories</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>Community</li>
                <li>Language Tips</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
