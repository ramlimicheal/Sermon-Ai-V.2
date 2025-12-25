# AI Provider Testing & Performance Guide

## Overview

Your sermon builder application now supports dual AI providers (MegaLLM and OpenRouter) with comprehensive testing, comparison, and performance tracking capabilities.

## Features

### 1. API Testing Dashboard
Test and validate API connections for both providers.

**Location:** Navigate to "AI Testing" in the sidebar

**Features:**
- Real-time API key validation
- Connection health checks
- Response time measurements
- Active provider switching
- Configuration guidance

### 2. Side-by-Side Comparison
Compare outputs from both providers simultaneously.

**How to use:**
1. Enter a scripture passage (e.g., "John 3:16")
2. Select a feature to test (Commentary, Illustrations, etc.)
3. Choose language (English or Tamil)
4. Click "Run Comparison"
5. Review both outputs side-by-side
6. Select your preferred provider

**Tracked metrics:**
- Response time
- Success rate
- Output quality
- Your preferences

### 3. Performance Analytics
View detailed performance metrics and trends.

**Metrics tracked:**
- Total requests per provider
- Success rates
- Average response times
- Performance by feature
- User preference statistics
- Historical trends (7/30 days)

**Export options:**
- Download JSON reports
- Historical data analysis

## Setup Instructions

### MegaLLM (Already Configured)
Your MegaLLM API key is already configured and working:
```
VITE_MEGALLM_API_KEY=sk-mega-...
```

### OpenRouter (New Provider)

1. **Get your API key:**
   - Visit [openrouter.ai/keys](https://openrouter.ai/keys)
   - Sign up or log in
   - Generate a new API key

2. **Add to your .env file:**
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-...
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

4. **Test the connection:**
   - Navigate to AI Testing → API Testing
   - Click "Test" next to OpenRouter
   - Verify green checkmark appears

## Testing Workflow

### Initial Setup Testing
1. Go to AI Testing Hub
2. Click "Test All" to validate both providers
3. Review response times and success rates
4. Set your preferred provider

### Feature Comparison
1. Navigate to "Side-by-Side" tab
2. Test each feature:
   - Commentary
   - Illustrations
   - Sermon Outline
   - Cross References
   - Applications
   - Exegetical Notes
   - Greek/Hebrew Analysis
   - Historical Context

3. For each feature:
   - Run comparison with same scripture
   - Compare quality of responses
   - Note response times
   - Select preferred provider

### Performance Review
1. Navigate to "Analytics" tab
2. Review aggregated metrics
3. Identify best-performing provider per feature
4. Export reports for decision-making

## Decision Matrix

Use these criteria to evaluate providers:

### Speed
- MegaLLM: Typically 2-5 seconds
- OpenRouter: Typically 3-7 seconds

### Reliability
- Check success rates in Analytics
- Review error frequency
- Test during peak hours

### Quality
- Compare theological accuracy
- Evaluate language support (Tamil)
- Review commentary depth
- Test illustration relevance

### Cost
- MegaLLM: Lower cost per request
- OpenRouter: Higher cost, more model options

## Best Practices

### 1. Test Thoroughly
- Run at least 10 comparisons per feature
- Test during different times of day
- Try various scripture passages
- Test both languages

### 2. Track Your Preferences
- Use the "Choose This" button in comparisons
- Review preference summary in Analytics
- Consider feature-specific preferences

### 3. Monitor Performance
- Check Analytics weekly
- Export monthly reports
- Watch for degradation trends
- Test after provider updates

### 4. Hybrid Approach
Consider using both providers:
- Primary provider for speed-critical features
- Secondary provider as fallback
- Feature-specific provider selection

## Database Tables

Your test results are stored in Supabase:

### ai_test_results
Stores individual API test results:
- Provider used
- Feature tested
- Response time
- Success/failure
- Error messages

### ai_comparison_results
Stores side-by-side comparison data:
- Both provider responses
- Performance metrics
- Your quality ratings
- Preferred provider selection

### ai_provider_preferences
Stores your provider preferences:
- Preferred provider
- Auto-fallback settings

## Troubleshooting

### Connection Failures
1. Verify API key in .env file
2. Check API key hasn't expired
3. Ensure no network restrictions
4. Review error messages in console

### Slow Response Times
1. Check your internet connection
2. Test during off-peak hours
3. Try different scripture passages
4. Contact provider support if persistent

### Failed Comparisons
1. Ensure both providers are configured
2. Check API key validity
3. Review error messages
4. Try simpler test cases first

## API Provider Details

### MegaLLM
- **Base URL:** https://ai.megallm.io/v1
- **Default Model:** llama3-8b-instruct
- **Best For:** Fast responses, cost-effective
- **Supports:** Streaming, JSON mode

### OpenRouter
- **Base URL:** https://openrouter.ai/api/v1
- **Default Model:** meta-llama/llama-3.1-8b-instruct:free
- **Best For:** Model flexibility, reliability
- **Supports:** Streaming, JSON mode, multiple models

## Making Your Decision

After thorough testing, consider:

1. **Single Provider:** Choose the best-performing one
   - Simplest implementation
   - Consistent behavior
   - Lower maintenance

2. **Dual Provider with Fallback:** Keep both
   - Higher reliability
   - Automatic failover
   - Best of both worlds

3. **Feature-Specific:** Use different providers per feature
   - Optimize each feature
   - More complex setup
   - Maximum performance

## Next Steps

1. **Test Both Providers:**
   - Click "Test All" in API Testing
   - Verify both show green checkmarks

2. **Run Comparisons:**
   - Test at least 5 features
   - Try both English and Tamil
   - Review outputs carefully

3. **Review Analytics:**
   - Check success rates
   - Compare response times
   - Review your preferences

4. **Make Decision:**
   - Choose primary provider
   - Configure fallback (optional)
   - Document your choice

5. **Monitor Ongoing:**
   - Weekly analytics reviews
   - Monthly performance reports
   - Adjust as needed

## Support

For issues or questions:
- Check error messages in AI Testing dashboard
- Review Analytics for performance trends
- Export reports for detailed analysis
- Test with simple passages first

## Summary

You now have a comprehensive AI provider testing system that allows you to:
- Validate API connections
- Compare outputs side-by-side
- Track performance metrics
- Make data-driven decisions
- Monitor ongoing performance

Use this system to confidently choose the best AI provider for your sermon preparation needs.
